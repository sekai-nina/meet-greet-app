import type { FC } from 'react';
import { Modal, ScrollView, Text, TouchableOpacity, View } from 'react-native';

import { User } from 'phosphor-react-native';

type PopularityCell = {
  dayLabel: string;
  slotNumber: number;
  symbol: string;
  level: 'no_data' | 'available' | 'slightly_busy' | 'busy' | 'sold_out';
};

type PopularityModalProps = {
  isVisible: boolean;
  onClose: () => void;
  memberName: string;
  releaseLabel: string;
  dayLabels: string[];
  slotCount: number;
  cells: PopularityCell[];
  updatedAt: string | null;
};

const LEVEL_STYLES: Record<string, { bg: string; text: string }> = {
  no_data: { bg: 'bg-gray-100', text: 'text-gray-400' },
  available: { bg: 'bg-[#D4EDDA]', text: 'text-[#2D6A3E]' },
  slightly_busy: { bg: 'bg-[#FFF5A0]', text: 'text-[#856404]' },
  busy: { bg: 'bg-[#FFE0E0]', text: 'text-[#E5484D]' },
  sold_out: { bg: 'bg-[#B8C5D0]', text: 'text-[#14253A]' },
};

const LEVEL_LABELS: Record<string, string> = {
  no_data: '',
  available: '余裕あり',
  slightly_busy: 'やや混雑',
  busy: '混雑',
  sold_out: '完売',
};

export const PopularityModal: FC<PopularityModalProps> = ({
  isVisible,
  onClose,
  memberName,
  releaseLabel,
  dayLabels,
  slotCount,
  cells,
  updatedAt,
}) => {
  const cellMap = new Map<string, PopularityCell>();
  for (const cell of cells) {
    cellMap.set(`${cell.dayLabel}:${cell.slotNumber}`, cell);
  }

  const slots = Array.from({ length: slotCount }, (_, i) => i + 1);

  return (
    <Modal
      visible={isVisible}
      animationType="fade"
      transparent
      onRequestClose={onClose}
    >
      <View className="flex-1 items-center justify-center bg-black/50 px-4">
        <View className="bg-white rounded-2xl w-full max-w-[380px] max-h-[80%]">
          {/* Header */}
          <View className="flex-row items-center justify-between px-5 py-4 border-b border-gray-100">
            <Text className="text-lg font-bold text-gray-800">人気状況</Text>
            <TouchableOpacity onPress={onClose} accessibilityLabel="閉じる">
              <Text className="text-2xl text-gray-400">✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView contentContainerStyle={{ padding: 20 }}>
            {/* Member info */}
            <View className="flex-row items-center mb-4">
              <View className="w-10 h-10 rounded-full bg-gray-200 items-center justify-center mr-3">
                <User size={20} color="#5A6B78" />
              </View>
              <View>
                <Text className="text-base font-bold text-gray-800">
                  {memberName}
                </Text>
                <Text className="text-xs text-gray-500">{releaseLabel}</Text>
              </View>
            </View>

            {/* Heatmap */}
            <View>
              {/* Header */}
              <View className="flex-row">
                <View className="w-8" />
                {dayLabels.map((label) => (
                  <View key={label} className="flex-1 items-center px-0.5">
                    <Text className="text-[10px] font-medium text-gray-600 text-center">
                      {label}
                    </Text>
                  </View>
                ))}
              </View>
              {/* Rows */}
              {slots.map((slotNum) => (
                <View key={slotNum} className="flex-row mt-1">
                  <View className="w-8 justify-center">
                    <Text className="text-[10px] text-gray-600">
                      {slotNum}部
                    </Text>
                  </View>
                  {dayLabels.map((dayLabel) => {
                    const cell = cellMap.get(`${dayLabel}:${slotNum}`);
                    const level = cell?.level ?? 'no_data';
                    const symbol = cell?.symbol ?? (level === 'no_data' ? '—' : '◎');
                    const style = LEVEL_STYLES[level];

                    return (
                      <View
                        key={`${dayLabel}:${slotNum}`}
                        className={`flex-1 h-10 mx-0.5 rounded items-center justify-center ${style.bg}`}
                        accessibilityLabel={`${dayLabel} ${slotNum}部 ${LEVEL_LABELS[level]}`}
                      >
                        <Text className={`text-base ${style.text}`}>
                          {symbol}
                        </Text>
                      </View>
                    );
                  })}
                </View>
              ))}
            </View>

            {/* Legend */}
            <View className="flex-row flex-wrap mt-3 gap-3">
              {Object.entries(LEVEL_STYLES)
                .filter(([level]) => LEVEL_LABELS[level] !== '')
                .map(([level, style]) => (
                <View key={level} className="flex-row items-center">
                  <View className={`w-4 h-4 rounded mr-1 ${style.bg}`} />
                  <Text className="text-xs text-gray-600">
                    {LEVEL_LABELS[level]}
                  </Text>
                </View>
              ))}
            </View>

            {/* Updated at */}
            {updatedAt && (
              <Text className="text-xs text-gray-400 mt-3">
                完売情報: {updatedAt} 更新
              </Text>
            )}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};
