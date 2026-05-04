import type { FC } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

type SlotStepperProps = {
  slotNumber: number;
  timeRange?: string;
  count: number;
  maxCount?: number;
  isSoldOut?: boolean;
  popularityBadge?: string | null;
  onIncrement: () => void;
  onDecrement: () => void;
};

const BADGE_STYLES: Record<string, { bg: string; text: string }> = {
  完売: { bg: 'bg-[#FFE0E0]', text: 'text-[#C0392B]' },
  混雑: { bg: 'bg-[#FFE0E0]', text: 'text-[#E5484D]' },
  やや混雑: { bg: 'bg-[#FFF5A0]', text: 'text-[#856404]' },
  余裕あり: { bg: 'bg-[#D4EDDA]', text: 'text-[#2D6A3E]' },
};

function formatTime(isoStr: string): string {
  const d = new Date(isoStr);
  const h = String(d.getHours()).padStart(2, '0');
  const min = String(d.getMinutes()).padStart(2, '0');
  return `${h}:${min}`;
}

export function slotTimeRange(startsAt: string, endsAt: string): string {
  return `${formatTime(startsAt)}〜${formatTime(endsAt)}`;
}

const DEFAULT_MAX_COUNT = 5;

export const SlotStepper: FC<SlotStepperProps> = ({
  slotNumber,
  timeRange,
  count,
  maxCount = DEFAULT_MAX_COUNT,
  isSoldOut = false,
  popularityBadge,
  onIncrement,
  onDecrement,
}) => {
  const badge = popularityBadge ? BADGE_STYLES[popularityBadge] : null;

  return (
    <View className="flex-row items-center py-2.5 border-b border-divider">
      <Text className="text-sm text-text w-10">{slotNumber}部</Text>

      {timeRange && (
        <Text className="text-xs text-text-muted mr-2">{timeRange}</Text>
      )}

      {badge && (
        <View className={`rounded-full px-2 py-0.5 mr-2 ${badge.bg}`}>
          <Text className={`text-xs font-medium ${badge.text}`}>
            {popularityBadge}
          </Text>
        </View>
      )}

      <View className="flex-1" />

      {isSoldOut ? (
        <Text className="text-sm text-gray-400">—</Text>
      ) : (
        <View className="flex-row items-center">
          <TouchableOpacity
            className="w-8 h-8 rounded-full bg-gray-100 items-center justify-center"
            onPress={onDecrement}
            disabled={count <= 0}
            accessibilityLabel={`${slotNumber}部を減らす`}
          >
            <Text className="text-lg text-gray-600">−</Text>
          </TouchableOpacity>
          <Text className="text-base font-bold text-text mx-3 min-w-[20px] text-center">
            {count}
          </Text>
          <TouchableOpacity
            className="w-8 h-8 rounded-full bg-gray-100 items-center justify-center"
            onPress={onIncrement}
            disabled={count >= maxCount}
            accessibilityLabel={`${slotNumber}部を増やす`}
          >
            <Text className={`text-lg ${count >= maxCount ? 'text-gray-300' : 'text-gray-600'}`}>+</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};
