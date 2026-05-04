import { useQuery } from '@tanstack/react-query';

import { supabase } from '@/lib/supabase';

const DEFAULT_WIN_RATE = 50;

type SlotDetail = {
  dayNumber: number;
  date: string;
  slotNumber: number;
  appliedCount: number;
};

type MemberBreakdown = {
  memberId: string;
  memberName: string;
  appliedCount: number;
  winRate: number;
  estimate: number;
  slots: SlotDetail[];
};

export type PaymentEstimate = {
  /** 確定当選枚数 (通常盤) */
  regularWonCount: number;
  /** 申込中枚数 (通常盤, 抽選待ち) */
  regularPendingCount: number;
  /** 確定当選の支払額 (通常盤) */
  confirmedPayment: number;
  /** 申込中の見込み支払額 (メンバーごとの予想当選割合を加味) */
  estimatedPayment: number;
  /** 内訳: メンバーごとの見込み */
  memberBreakdown: MemberBreakdown[];
  /** @deprecated registrationBreakdown は memberBreakdown に移行 */
  registrationBreakdown: MemberBreakdown[];
};

export function usePaymentEstimate(releaseId: string | undefined) {
  return useQuery({
    queryKey: ['payment-estimate', releaseId],
    queryFn: async (): Promise<PaymentEstimate> => {
      const emptyResult: PaymentEstimate = {
        regularWonCount: 0,
        regularPendingCount: 0,
        confirmedPayment: 0,
        estimatedPayment: 0,
        memberBreakdown: [],
        registrationBreakdown: [],
      };

      // 1. このリリースの通常盤イベントを取得
      const { data: events, error: eventsError } = await supabase
        .from('events')
        .select('id, unit_price')
        .eq('release_id', releaseId!)
        .eq('cd_type', 'regular');
      if (eventsError) throw eventsError;
      if (!events?.length) return emptyResult;

      const unitPrice = events[0].unit_price;
      const eventIds = events.map((e) => e.id);

      // 2. 受付次を取得
      const { data: rounds, error: roundsError } = await supabase
        .from('reception_rounds')
        .select('id')
        .in('event_id', eventIds);
      if (roundsError) throw roundsError;
      const roundIds = (rounds ?? []).map((r) => r.id);
      if (roundIds.length === 0) return emptyResult;

      // 3. round_applications から確定当選・申込中を集計 + 申込中の詳細を取得
      // RLS で auth.uid() = user_id が適用される。
      // service_role や RPC 化する場合は明示的に user_id フィルターが必要。
      const { data: applications, error: appError } = await supabase
        .from('round_applications')
        .select('event_slot_id, member_id, applied_count, won_count')
        .in('reception_round_id', roundIds);
      if (appError) throw appError;

      let totalWon = 0;
      let totalPending = 0;
      // member_id → { total, slotIds[] } for pending applications
      const pendingByMember = new Map<string, { total: number; items: { eventSlotId: string; appliedCount: number }[] }>();

      for (const app of applications ?? []) {
        if (app.won_count === null) {
          totalPending += app.applied_count;
          const prev = pendingByMember.get(app.member_id) ?? { total: 0, items: [] };
          prev.total += app.applied_count;
          prev.items.push({ eventSlotId: app.event_slot_id, appliedCount: app.applied_count });
          pendingByMember.set(app.member_id, prev);
        } else {
          totalWon += app.won_count;
        }
      }

      if (pendingByMember.size === 0) {
        return {
          ...emptyResult,
          regularWonCount: totalWon,
          regularPendingCount: totalPending,
          confirmedPayment: totalWon * unitPrice,
        };
      }

      // 4. round_application_rates から最新の予想当選割合を取得
      const { data: rates, error: ratesError } = await supabase
        .from('round_application_rates')
        .select('member_id, expected_win_rate')
        .in('reception_round_id', roundIds);
      if (ratesError) throw ratesError;

      // member_id → latest win rate (last entry wins if multiple rounds)
      const rateMap = new Map<string, number>();
      for (const r of rates ?? []) {
        rateMap.set(r.member_id, r.expected_win_rate);
      }

      // 5. スロット→日程情報を取得
      const allSlotIds = [...new Set([...pendingByMember.values()].flatMap((m) => m.items.map((i) => i.eventSlotId)))];
      if (allSlotIds.length === 0) {
        return {
          ...emptyResult,
          regularWonCount: totalWon,
          regularPendingCount: totalPending,
          confirmedPayment: totalWon * unitPrice,
        };
      }

      const { data: slotsData, error: slotsError } = await supabase
        .from('event_slots')
        .select('id, slot_number, event_day_id')
        .in('id', allSlotIds);
      if (slotsError) throw slotsError;

      const dayIds = [...new Set((slotsData ?? []).map((s) => s.event_day_id))];
      if (dayIds.length === 0) {
        return {
          ...emptyResult,
          regularWonCount: totalWon,
          regularPendingCount: totalPending,
          confirmedPayment: totalWon * unitPrice,
        };
      }

      const { data: daysData, error: daysError } = await supabase
        .from('event_days')
        .select('id, day_number, date')
        .in('id', dayIds);
      if (daysError) throw daysError;

      const dayMap = new Map((daysData ?? []).map((d) => [d.id, d]));
      const slotInfoMap = new Map(
        (slotsData ?? []).map((s) => {
          const day = dayMap.get(s.event_day_id);
          return [s.id, { slotNumber: s.slot_number, dayNumber: day?.day_number ?? 0, date: day?.date ?? '' }];
        }),
      );

      // 6. メンバー名を取得
      const memberIds = [...pendingByMember.keys()];
      if (memberIds.length === 0) {
        return {
          ...emptyResult,
          regularWonCount: totalWon,
          regularPendingCount: totalPending,
          confirmedPayment: totalWon * unitPrice,
        };
      }

      const { data: members, error: membersError } = await supabase
        .from('members')
        .select('id, name')
        .in('id', memberIds);
      if (membersError) throw membersError;
      const memberNameMap = new Map((members ?? []).map((m) => [m.id, m.name]));

      // 7. メンバーごとに見込み金額を計算
      const breakdown: MemberBreakdown[] = [];
      let estimatedPayment = 0;

      for (const [memberId, agg] of pendingByMember) {
        const winRate = rateMap.get(memberId) ?? DEFAULT_WIN_RATE;
        const estimate = Math.round(agg.total * (winRate / 100) * unitPrice);
        estimatedPayment += estimate;

        const slots: SlotDetail[] = agg.items
          .map((item) => {
            const info = slotInfoMap.get(item.eventSlotId);
            return info
              ? {
                  dayNumber: info.dayNumber,
                  date: info.date,
                  slotNumber: info.slotNumber,
                  appliedCount: item.appliedCount,
                }
              : null;
          })
          .filter((s): s is SlotDetail => s !== null)
          .sort((a, b) => a.dayNumber - b.dayNumber || a.slotNumber - b.slotNumber);

        breakdown.push({
          memberId,
          memberName: memberNameMap.get(memberId) ?? '不明',
          appliedCount: agg.total,
          winRate,
          estimate,
          slots,
        });
      }

      return {
        regularWonCount: totalWon,
        regularPendingCount: totalPending,
        confirmedPayment: totalWon * unitPrice,
        estimatedPayment,
        memberBreakdown: breakdown,
        registrationBreakdown: breakdown,
      };
    },
    enabled: !!releaseId,
  });
}
