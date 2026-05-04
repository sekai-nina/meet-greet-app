import type { FC } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

import type { ReceptionBadgeStatus } from '@/lib/format-labels';

import { RoundCard } from './RoundCard';

type RoundData = {
  roundNumber: number;
  startAt: string;
  endAt: string;
  maxApplications: number;
  eventFormatLabel: string;
  status: ReceptionBadgeStatus;
};

type ReceptionSectionProps = {
  round: RoundData | null;
  onPressShowAll: () => void;
};

export const ReceptionSection: FC<ReceptionSectionProps> = ({
  round,
  onPressShowAll,
}) => (
  <View className="mx-4 mt-4">
    <View className="flex-row items-center justify-between mb-3">
      <Text className="text-lg font-bold text-text">
        受付スケジュール
      </Text>
      <TouchableOpacity
        onPress={onPressShowAll}
        accessibilityRole="button"
        accessibilityLabel="すべて見る"
      >
        <Text className="text-sm text-primary">すべて見る</Text>
      </TouchableOpacity>
    </View>
    {round ? (
      <RoundCard {...round} />
    ) : (
      <View className="rounded-xl border border-border bg-white p-4">
        <Text className="text-sm text-text-muted text-center">
          予定されている受付はありません
        </Text>
      </View>
    )}
  </View>
);
