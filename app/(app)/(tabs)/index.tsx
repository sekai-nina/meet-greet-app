import { useState } from 'react';
import { ScrollView, Text, View } from 'react-native';

import { useRouter } from 'expo-router';

import { CurrentSingleCard } from '@/components/CurrentSingleCard';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { DayTableSection } from '@/components/DayTableSection';
import { FloatingActionButton } from '@/components/FloatingActionButton';
import { PaymentModal } from '@/components/PaymentModal';
import { ReceptionScheduleModal } from '@/components/ReceptionScheduleModal';
import { ReceptionSection } from '@/components/ReceptionSection';
import { TicketAccordion } from '@/components/TicketAccordion';
import { useAllReceptions } from '@/hooks/use-all-receptions';
import { useLatestRelease } from '@/hooks/use-latest-release';
import { useNextReception } from '@/hooks/use-next-reception';
import { useAppliedMembers } from '@/hooks/use-applied-members';
import { usePaymentEstimate } from '@/hooks/use-payment-estimate';
import { useParticipationHeatmap } from '@/hooks/use-participation-heatmap';
import { useReleaseEvents } from '@/hooks/use-release-events';
import { useReleaseSummary } from '@/hooks/use-release-summary';
import { useWonTickets } from '@/hooks/use-won-tickets';
import { FORMAT_LABELS, getReceptionStatus, sortByFormatOrder } from '@/lib/format-labels';
import { useHomeFilterStore } from '@/stores/home-filter-store';

const RELEASE_BG_IMAGE = require('../../../docs/assets/releases/17th-kind-of-love.png') as number;

export default function HomeTab() {
  const router = useRouter();
  const { data: release, isLoading: isLoadingRelease } = useLatestRelease();
  const releaseId = release?.id;

  const { data: summary } = useReleaseSummary(releaseId);
  const { data: nextRound } = useNextReception(releaseId);
  const { data: wonTickets } = useWonTickets(releaseId);
  const { data: appliedMembers } = useAppliedMembers(releaseId);
  const { data: releaseEvents } = useReleaseEvents(releaseId);
  const { data: allReceptions } = useAllReceptions(releaseId);
  const isPaymentModalVisible = useHomeFilterStore(
    (s) => s.isPaymentModalVisible,
  );
  const { data: paymentEstimate } = usePaymentEstimate(
    isPaymentModalVisible ? releaseId : undefined,
  );

  const selectedMemberId = useHomeFilterStore((s) => s.selectedMemberId);
  const setSelectedMemberId = useHomeFilterStore((s) => s.setSelectedMemberId);

  const { data: heatmapData } = useParticipationHeatmap(
    releaseId,
    selectedMemberId,
  );

  const [isScheduleModalVisible, setScheduleModalVisible] = useState(false);
  const setPaymentModalVisible = useHomeFilterStore(
    (s) => s.setPaymentModalVisible,
  );

  if (isLoadingRelease) {
    return (
      <View className="flex-1 items-center justify-center bg-bg">
        <LoadingSpinner />
      </View>
    );
  }

  if (!release) {
    return (
      <View className="flex-1 items-center justify-center bg-bg">
        <Text className="text-text-muted">リリース情報がありません</Text>
      </View>
    );
  }

  // 受付次データの変換
  const roundData = nextRound
    ? {
        roundNumber: nextRound.round_number,
        startAt: nextRound.start_at,
        endAt: nextRound.end_at,
        maxApplications: nextRound.max_applications,
        eventFormatLabel:
          FORMAT_LABELS[nextRound.events.format] ?? nextRound.events.format,
        status: getReceptionStatus(nextRound.start_at, nextRound.end_at),
      }
    : null;

  // チケットデータの変換
  const ticketRows = (wonTickets ?? []).map((t) => {
    const d = new Date(t.date);
    const dateLabel = `${d.getMonth() + 1}/${d.getDate()}`;
    const startH = new Date(t.startsAt).getHours();
    const startM = String(new Date(t.startsAt).getMinutes()).padStart(2, '0');
    const endH = new Date(t.endsAt).getHours();
    const endM = String(new Date(t.endsAt).getMinutes()).padStart(2, '0');
    const timeRange = `${startH}:${startM}〜${endH}:${endM}`;
    return {
      id: `${t.eventSlotId}:${t.memberId}`,
      date: dateLabel,
      dayNumber: t.dayNumber,
      slotNumber: t.slotNumber,
      timeRange,
      memberName: t.memberName,
      format: t.eventFormat,
      count: t.totalWon,
    };
  });

  // ヒートマップデータの変換 (通常版→リアル→初回限定盤の順)
  const sortedEvents = sortByFormatOrder(releaseEvents ?? []);
  const heatmapTables = sortedEvents.map((event) => {
    const sortedDays = [...event.event_days].sort(
      (a, b) => a.day_number - b.day_number,
    );
    const maxSlots = Math.max(
      ...event.event_days.flatMap((d) =>
        d.event_slots.map((s) => s.slot_number),
      ),
      0,
    );

    return {
      format: event.format,
      title: FORMAT_LABELS[event.format] ?? event.format,
      dayLabels: sortedDays.map((d) => {
        const date = new Date(d.date);
        const dateStr = `${date.getMonth() + 1}/${date.getDate()}`;
        const dayOfWeek = date.getDay();
        // 土=blue, 日=red, 平日=default
        let color: 'blue' | 'red' | 'default' = 'default';
        if (dayOfWeek === 6) color = 'blue';
        else if (dayOfWeek === 0) color = 'red';
        return {
          id: d.id,
          label: dateStr,
          subLabel: d.venue ?? undefined,
          color,
        };
      }),
      slotCount: maxSlots,
      cells: (heatmapData ?? []).filter((c) =>
        sortedDays.some((d) => d.id === c.eventDayId),
      ),
    };
  });

  // メンバーフィルター用データ: 申込み済みのメンバーのみ
  const memberOptions = appliedMembers ?? [];

  // M2: 受付スケジュール用データ
  const scheduleSections = (() => {
    if (!allReceptions) return [];
    const grouped = new Map<string, { format: string; rounds: typeof allReceptions }>();
    for (const r of allReceptions) {
      const format = r.events.format;
      const existing = grouped.get(format);
      if (existing) {
        existing.rounds.push(r);
      } else {
        grouped.set(format, { format, rounds: [r] });
      }
    }
    const sections = [...grouped.values()];
    return sortByFormatOrder(sections).map((g) => ({
      format: g.format,
      rounds: g.rounds.map((r) => ({
        id: r.id,
        roundNumber: r.round_number,
        startAt: r.start_at,
        endAt: r.end_at,
        maxApplications: r.max_applications,
      })),
    }));
  })();

  return (
    <View className="flex-1 bg-bg">
      <ScrollView>
        <CurrentSingleCard
          releaseNumber={release.number}
          releaseTitle={release.title}
          totalWon={summary?.total_won ?? 0}
          totalApplied={summary?.total_applied ?? 0}
          usedSerials={summary?.used_serials ?? 0}
          pendingSerials={summary?.pending_serials ?? 0}
          onPressDetail={() => router.push('/(app)/home/event-detail')}
          backgroundImage={RELEASE_BG_IMAGE}
        />

        <ReceptionSection
          round={roundData}
          onPressShowAll={() => setScheduleModalVisible(true)}
        />

        <TicketAccordion
          totalWon={summary?.total_won ?? 0}
          tickets={ticketRows}
        />

        <DayTableSection
          tables={heatmapTables}
          members={memberOptions}
          selectedMemberId={selectedMemberId}
          onSelectMember={setSelectedMemberId}
        />
      </ScrollView>

      <FloatingActionButton
        onPress={() => router.push('/(app)/home/apply-type')}
      />

      {/* M2: 受付スケジュール一覧 */}
      <ReceptionScheduleModal
        isVisible={isScheduleModalVisible}
        onClose={() => setScheduleModalVisible(false)}
        sections={scheduleSections}
      />

      {/* M3: 支払い見込み */}
      <PaymentModal
        isVisible={isPaymentModalVisible}
        onClose={() => setPaymentModalVisible(false)}
        estimate={paymentEstimate ?? null}
        serialUnitPrice={releaseEvents?.find((e) => e.cd_type === 'limited')?.unit_price}
      />
    </View>
  );
}
