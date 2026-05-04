import { ScrollView, Text, View } from 'react-native';

import { useRouter } from 'expo-router';
import { MapPin, Monitor, Star } from 'phosphor-react-native';

import { Button } from '@/components/Button';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { useLatestRelease } from '@/hooks/use-latest-release';
import { useReleaseEvents } from '@/hooks/use-release-events';
import { FORMAT_LABELS, sortByFormatOrder } from '@/lib/format-labels';

const WEEKDAYS = ['日', '月', '火', '水', '木', '金', '土'];
const WEEKEND_COLORS: Record<string, string> = {
  土: 'text-blue-600',
  日: 'text-red-600',
};

function formatDate(dateStr: string): { label: string; weekday: string } {
  const d = new Date(dateStr);
  const m = d.getMonth() + 1;
  const day = d.getDate();
  const wd = WEEKDAYS[d.getDay()];
  return { label: `${m}/${day}(${wd})`, weekday: wd };
}

function formatTime(isoStr: string): string {
  const d = new Date(isoStr);
  const h = String(d.getHours()).padStart(2, '0');
  const min = String(d.getMinutes()).padStart(2, '0');
  return `${h}:${min}`;
}

const FORMAT_ICON_COMPONENTS: Record<string, React.ReactNode> = {
  regular_online: <Monitor size={20} color="#5BBEE5" />,
  limited_online: <Star size={20} color="#F59E0B" weight="fill" />,
  real: <MapPin size={20} color="#E5484D" />,
};

export default function EventDetailScreen() {
  const router = useRouter();
  const { data: release } = useLatestRelease();
  const { data: events, isLoading } = useReleaseEvents(release?.id);

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-bg">
        <LoadingSpinner />
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-bg" contentContainerStyle={{ padding: 16 }}>
      {sortByFormatOrder(events ?? []).map((event) => {
        const sortedDays = [...event.event_days].sort(
          (a, b) => a.day_number - b.day_number,
        );

        // 全日程共通のスロット情報 (最初の日からサンプル取得)
        const sampleSlots = sortedDays[0]?.event_slots
          ? [...sortedDays[0].event_slots].sort(
              (a, b) => a.slot_number - b.slot_number,
            )
          : [];

        return (
          <View key={event.id} className="mb-6">
            {/* セクションヘッダー */}
            <View className="flex-row items-center mb-3">
              <View className="mr-2">
                {FORMAT_ICON_COMPONENTS[event.format] ?? null}
              </View>
              <Text className="text-lg font-bold text-text">
                {FORMAT_LABELS[event.format] ?? event.format}
              </Text>
            </View>

            {/* 開催日程リスト */}
            <View className="rounded-xl border border-border bg-white p-4 mb-3">
              <Text className="text-sm font-semibold text-text mb-2">
                開催日程
              </Text>
              {sortedDays.map((day) => {
                const { label, weekday } = formatDate(day.date);
                const color = WEEKEND_COLORS[weekday] ?? 'text-text';
                return (
                  <View
                    key={day.id}
                    className="flex-row items-center py-1.5 border-b border-divider"
                  >
                    <View className="bg-primary-soft rounded-full px-2 py-0.5 mr-3">
                      <Text className="text-xs font-medium text-text">
                        DAY{day.day_number}
                      </Text>
                    </View>
                    <Text className={`text-sm font-medium ${color}`}>
                      {label}
                    </Text>
                    {day.venue && (
                      <Text className="text-sm text-text-muted ml-2">
                        {day.venue}
                      </Text>
                    )}
                  </View>
                );
              })}
            </View>

            {/* 注意書き */}
            <View className="rounded-xl bg-amber-50 border border-amber-200 p-3 mb-3">
              <Text className="text-xs text-amber-800">
                全日程共通のタイムスケジュールです。{'\n'}
                受付開始は各部の開始15分前、受付終了は各部の終了15分前です。
              </Text>
            </View>

            {/* タイムテーブル */}
            <View className="rounded-xl border border-border bg-white p-4">
              <Text className="text-sm font-semibold text-text mb-2">
                タイムテーブル
              </Text>
              <View className="flex-row border-b border-border pb-2 mb-2">
                <Text className="text-xs font-medium text-text-muted w-12">
                  部
                </Text>
                <Text className="text-xs font-medium text-text-muted flex-1">
                  時間
                </Text>
                <Text className="text-xs font-medium text-text-muted w-24">
                  受付
                </Text>
              </View>
              {sampleSlots.map((slot) => {
                const startTime = formatTime(slot.starts_at);
                const endTime = formatTime(slot.ends_at);
                // 受付: 開始15分前〜終了15分前
                const receptionStart = new Date(
                  new Date(slot.starts_at).getTime() - 15 * 60 * 1000,
                );
                const receptionEnd = new Date(
                  new Date(slot.ends_at).getTime() - 15 * 60 * 1000,
                );

                return (
                  <View
                    key={slot.id}
                    className="flex-row items-center py-2 border-b border-divider"
                  >
                    <Text className="text-sm font-medium text-text w-12">
                      {slot.slot_number}部
                    </Text>
                    <Text className="text-sm text-text-muted flex-1">
                      {startTime}〜{endTime}
                    </Text>
                    <Text className="text-xs text-text-muted w-24">
                      {formatTime(receptionStart.toISOString())}〜
                      {formatTime(receptionEnd.toISOString())}
                    </Text>
                  </View>
                );
              })}
            </View>
          </View>
        );
      })}

      <View className="mt-2 mb-8">
        <Button
          label="申込む"
          onPress={() => router.push('/(app)/home/apply-type')}
        />
      </View>
    </ScrollView>
  );
}
