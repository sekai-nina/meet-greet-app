import { useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';

import { useRouter } from 'expo-router';
import { ChartBar } from 'phosphor-react-native';

import { Button } from '@/components/Button';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { MemberPickerModal } from '@/components/MemberPickerModal';
import { PopularityModal } from '@/components/PopularityModal';
import { SlotStepper, slotTimeRange } from '@/components/SlotStepper';
import { useLatestRelease } from '@/hooks/use-latest-release';
import { useMembers } from '@/hooks/use-members';
import { useReleaseEvents } from '@/hooks/use-release-events';
import { useSlotPopularity, POPULARITY_LABEL } from '@/hooks/use-slot-popularity';
import { useApplyFormStore } from '@/stores/apply-form-store';

const WEEKDAYS = ['日', '月', '火', '水', '木', '金', '土'];
const MAX_ROUNDS = 6;
const SLOT_MAX_COUNT = 5;

export default function ApplyRegularScreen() {
  const router = useRouter();
  const { data: release } = useLatestRelease();
  const { data: allMembers } = useMembers();
  const { data: releaseEvents, isLoading } = useReleaseEvents(release?.id);

  const store = useApplyFormStore();
  const [isMemberPickerOpen, setMemberPickerOpen] = useState(false);
  const [isPopularityOpen, setPopularityOpen] = useState(false);

  // 通常盤オンラインイベントを取得
  const regularEvent = releaseEvents?.find(
    (e) => e.format === 'regular_online',
  );

  // 受付次: 1〜6次まで選択可能
  const selectedRoundNumber = store.roundNumber || 1;

  // メンバー選択
  const members = allMembers ?? [];
  const currentMemberId = store.currentMemberId ?? members[0]?.id ?? null;
  const currentMember = members.find((m) => m.id === currentMemberId);

  // 人気度データ
  const { data: popularityData } = useSlotPopularity(
    regularEvent?.id,
    currentMemberId,
  );
  const popularityMap = new Map(
    (popularityData ?? []).map((p) => [p.eventSlotId, p]),
  );

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-bg">
        <LoadingSpinner />
      </View>
    );
  }

  const sortedDays = regularEvent
    ? [...regularEvent.event_days].sort((a, b) => a.day_number - b.day_number)
    : [];

  const handleConfirm = () => {
    router.push('/(app)/home/confirm-regular');
  };

  return (
    <View className="flex-1 bg-bg">
      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 100 }}>
        {/* 受付次セレクター (1〜6次) */}
        <View className="rounded-xl border border-border bg-white p-4 mb-4">
          <Text className="text-xs text-text-muted mb-2">受付次数</Text>
          <View className="flex-row gap-2">
            {Array.from({ length: MAX_ROUNDS }, (_, i) => i + 1).map((num) => {
              const isSelected = num === selectedRoundNumber;
              return (
                <TouchableOpacity
                  key={num}
                  className={`flex-1 rounded-full py-2 items-center ${isSelected ? 'bg-primary' : 'bg-gray-100'}`}
                  onPress={() => store.setReceptionRound(`round-${num}`, num)}
                >
                  <Text
                    className={`text-sm font-medium ${isSelected ? 'text-text' : 'text-gray-700'}`}
                  >
                    {num}次
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* メンバーセレクター (プルダウン式) */}
        <View className="rounded-xl border border-border bg-white p-4 mb-4">
          <Text className="text-xs text-text-muted mb-2">メンバー</Text>
          <TouchableOpacity
            className="flex-row items-center justify-between rounded-lg border border-border px-4 py-3"
            onPress={() => setMemberPickerOpen(true)}
          >
            <Text className="text-base text-text">
              {currentMember?.name ?? 'メンバーを選択'}
            </Text>
            <Text className="text-gray-400">▼</Text>
          </TouchableOpacity>
        </View>

        {/* 人気状況ボタン */}
        <TouchableOpacity
          className="self-end mb-3 bg-primary-soft rounded-lg px-3 py-2"
          onPress={() => setPopularityOpen(true)}
          accessibilityRole="button"
        >
          <View className="flex-row items-center">
            <ChartBar size={16} color="#5BBEE5" />
            <Text className="text-sm text-primary font-medium ml-1">人気状況を見る</Text>
          </View>
        </TouchableOpacity>

        {/* 日程別スロット */}
        {sortedDays.map((day) => {
          const d = new Date(day.date);
          const dateLabel = `${d.getMonth() + 1}/${d.getDate()} (${WEEKDAYS[d.getDay()]})`;
          const sortedSlots = [...day.event_slots].sort(
            (a, b) => a.slot_number - b.slot_number,
          );

          return (
            <View key={day.id} className="rounded-xl border border-border bg-white p-4 mb-3">
              <View className="flex-row items-center mb-3">
                <View className="bg-primary-soft rounded-full px-2.5 py-0.5 mr-2">
                  <Text className="text-xs font-medium text-text">
                    DAY{day.day_number}
                  </Text>
                </View>
                <Text className="text-sm font-medium text-gray-700">
                  {dateLabel}
                </Text>
              </View>

              {sortedSlots.map((slot) => {
                const memberId = currentMemberId;
                const memberName = currentMember?.name ?? '';
                const app = memberId ? store.regularApplications.get(memberId) : undefined;
                const slotEntry = app?.slots.find(
                  (s) => s.eventSlotId === slot.id,
                );
                const count = slotEntry?.count ?? 0;
                const popularity = popularityMap.get(slot.id);
                const badge =
                  popularity && popularity.level !== 'no_data'
                    ? POPULARITY_LABEL[popularity.level]
                    : null;
                const isDisabled = !memberId;

                return (
                  <SlotStepper
                    key={slot.id}
                    slotNumber={slot.slot_number}
                    timeRange={slotTimeRange(slot.starts_at, slot.ends_at)}
                    count={count}
                    maxCount={SLOT_MAX_COUNT}
                    popularityBadge={badge}
                    isSoldOut={popularity?.level === 'sold_out' || isDisabled}
                    onIncrement={() =>
                      memberId && store.setSlotCount(memberId, memberName, {
                        eventSlotId: slot.id,
                        eventDayId: day.id,
                        dayNumber: day.day_number,
                        slotNumber: slot.slot_number,
                      }, count + 1)
                    }
                    onDecrement={() =>
                      memberId && store.setSlotCount(memberId, memberName, {
                        eventSlotId: slot.id,
                        eventDayId: day.id,
                        dayNumber: day.day_number,
                        slotNumber: slot.slot_number,
                      }, Math.max(0, count - 1))
                    }
                  />
                );
              })}
            </View>
          );
        })}

        {/* 注意書き */}
        <View className="rounded-xl bg-amber-50 border border-amber-200 p-3 mb-4">
          <Text className="text-xs text-amber-800">
            登録した情報は匿名で集計され、他のユーザーの完売情報の参考として利用されます。
          </Text>
        </View>

        {!currentMemberId && (
          <Text className="text-sm text-red-500 text-center mb-2">
            メンバーを選択してください
          </Text>
        )}
        <Button label="計画を確認する" onPress={handleConfirm} isDisabled={!currentMemberId} />
      </ScrollView>

      {/* メンバー選択モーダル */}
      <MemberPickerModal
        isVisible={isMemberPickerOpen}
        onClose={() => setMemberPickerOpen(false)}
        onSelect={(id, name) => store.setCurrentMember(id, name)}
        members={members}
        selectedMemberId={currentMemberId}
      />

      {/* 人気状況モーダル */}
      <PopularityModal
        isVisible={isPopularityOpen}
        onClose={() => setPopularityOpen(false)}
        memberName={currentMember?.name ?? ''}
        releaseLabel={release ? `${release.number}thシングル` : ''}
        dayLabels={sortedDays.map((d) => `DAY${d.day_number}`)}
        slotCount={Math.max(...sortedDays.map(d => d.event_slots.length), 0) || 6}
        cells={(popularityData ?? []).map((p) => {
          const day = sortedDays.find((d) => d.id === p.eventDayId);
          return {
            dayLabel: day ? `DAY${day.day_number}` : '',
            slotNumber: p.slotNumber,
            symbol: p.symbol,
            level: p.level,
          };
        })}
        updatedAt={null}
      />
    </View>
  );
}
