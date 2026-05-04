import type { FC } from 'react';
import { Text, View } from 'react-native';

import type { ReceptionBadgeStatus } from '@/lib/format-labels';
import { RECEPTION_STATUS_LABELS } from '@/lib/format-labels';

const BADGE_STYLES: Record<
  ReceptionBadgeStatus,
  { bg: string; text: string }
> = {
  before: { bg: 'bg-primary-soft', text: 'text-slate-500' },
  active: { bg: 'bg-green-100', text: 'text-green-800' },
  ended: { bg: 'bg-gray-100', text: 'text-gray-500' },
};

type RoundCardProps = {
  roundNumber: number;
  startAt: string;
  endAt: string;
  maxApplications: number;
  eventFormatLabel: string;
  status: ReceptionBadgeStatus;
};

function formatDateRange(startAt: string, endAt: string): string {
  const start = new Date(startAt);
  const end = new Date(endAt);
  const WEEKDAYS = ['日', '月', '火', '水', '木', '金', '土'];

  const fmt = (d: Date) => {
    const m = d.getMonth() + 1;
    const day = d.getDate();
    const wd = WEEKDAYS[d.getDay()];
    const h = d.getHours();
    const min = String(d.getMinutes()).padStart(2, '0');
    return `${m}/${day} (${wd}) ${h}:${min}`;
  };

  return `${fmt(start)} 〜 ${fmt(end)}`;
}

export const RoundCard: FC<RoundCardProps> = ({
  roundNumber,
  startAt,
  endAt,
  maxApplications,
  eventFormatLabel,
  status,
}) => {
  const badge = BADGE_STYLES[status];

  return (
    <View className="rounded-xl border border-border bg-white p-4">
      <View className="flex-row items-center justify-between mb-2">
        <View className="flex-row items-center">
          <View className="h-8 w-8 rounded-full bg-primary items-center justify-center mr-3">
            <Text className="text-sm font-bold text-text">
              {roundNumber}次
            </Text>
          </View>
          <Text className="text-sm text-gray-600">
            {formatDateRange(startAt, endAt)}
          </Text>
        </View>
        <View className={`rounded-full px-2.5 py-0.5 ${badge.bg}`}>
          <Text className={`text-xs font-medium ${badge.text}`}>
            {RECEPTION_STATUS_LABELS[status]}
          </Text>
        </View>
      </View>
      <Text className="text-xs text-text-muted">
        申込上限 {maxApplications}回 · {eventFormatLabel}
      </Text>
    </View>
  );
};
