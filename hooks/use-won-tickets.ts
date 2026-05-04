import { useQuery } from '@tanstack/react-query';

import { supabase } from '@/lib/supabase';

export type WonTicket = {
  eventSlotId: string;
  eventDayId: string;
  dayNumber: number;
  date: string;
  slotNumber: number;
  startsAt: string;
  endsAt: string;
  memberId: string;
  memberName: string;
  eventFormat: string;
  totalWon: number;
};

export function useWonTickets(releaseId: string | undefined) {
  return useQuery({
    queryKey: ['won-tickets', releaseId],
    queryFn: async () => {
      // v_participation_status はビューなので nested select 不可
      // フラットデータを取得してアプリ側で結合
      const { data: statusData, error: statusError } = await supabase
        .from('v_participation_status')
        .select('*')
        .eq('status', 'won');
      if (statusError) throw statusError;
      if (!statusData?.length) return [];

      // イベント情報を取得してリリースIDでフィルター
      const eventIds = [...new Set(statusData.map((s) => s.event_id))];
      const { data: events, error: eventsError } = await supabase
        .from('events')
        .select('id, format, release_id')
        .in('id', eventIds)
        .eq('release_id', releaseId!);
      if (eventsError) throw eventsError;

      const releaseEventIds = new Set(events?.map((e) => e.id) ?? []);
      const eventFormatMap = new Map(
        events?.map((e) => [e.id, e.format]) ?? [],
      );

      const filtered = statusData.filter((s) => releaseEventIds.has(s.event_id));
      if (!filtered.length) return [];

      // スロット・日程・メンバー情報を取得
      const slotIds = [...new Set(filtered.map((s) => s.event_slot_id))];
      const memberIds = [...new Set(filtered.map((s) => s.member_id))];

      const [slotsResult, membersResult] = await Promise.all([
        supabase
          .from('event_slots')
          .select('id, slot_number, starts_at, ends_at, event_day_id')
          .in('id', slotIds),
        supabase
          .from('members')
          .select('id, name')
          .in('id', memberIds),
      ]);

      if (slotsResult.error) throw slotsResult.error;
      if (membersResult.error) throw membersResult.error;

      const slotMap = new Map(
        slotsResult.data?.map((s) => [s.id, s]) ?? [],
      );
      const memberMap = new Map(
        membersResult.data?.map((m) => [m.id, m]) ?? [],
      );

      // 日程情報を取得
      const dayIds = [
        ...new Set(slotsResult.data?.map((s) => s.event_day_id) ?? []),
      ];
      const { data: days, error: daysError } = await supabase
        .from('event_days')
        .select('id, day_number, date')
        .in('id', dayIds);
      if (daysError) throw daysError;

      const dayMap = new Map(days?.map((d) => [d.id, d]) ?? []);

      return filtered.map((s): WonTicket => {
        const slot = slotMap.get(s.event_slot_id);
        const member = memberMap.get(s.member_id);
        const day = slot ? dayMap.get(slot.event_day_id) : undefined;

        return {
          eventSlotId: s.event_slot_id,
          eventDayId: s.event_day_id,
          dayNumber: day?.day_number ?? 0,
          date: day?.date ?? '',
          slotNumber: s.slot_number,
          startsAt: slot?.starts_at ?? '',
          endsAt: slot?.ends_at ?? '',
          memberId: s.member_id,
          memberName: member?.name ?? '',
          eventFormat: eventFormatMap.get(s.event_id) ?? '',
          totalWon: s.total_won,
        };
      });
    },
    enabled: !!releaseId,
  });
}
