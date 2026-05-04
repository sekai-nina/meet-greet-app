import type { FC } from 'react';
import { Text, View } from 'react-native';

export type HeatmapCellData = {
  eventDayId: string;
  slotNumber: number;
  won: number;
  pending: number;
};

type DayLabel = {
  id: string;
  label: string;
  subLabel?: string;
  color?: 'blue' | 'red' | 'default';
};

type HeatmapGridProps = {
  title: string;
  dayLabels: DayLabel[];
  slotCount: number;
  cells: HeatmapCellData[];
};

const CELL_BG_WON = 'bg-[#D4EDDA]';
const CELL_TEXT_WON = 'text-[#2D6A3E]';
const CELL_BG_PENDING = 'bg-[#FFF5A0]';
const CELL_TEXT_PENDING = 'text-[#856404]';
const CELL_BG_EMPTY = 'bg-[#E8EDF2]';
const CELL_TEXT_EMPTY = 'text-[#8494A7]';

function getCellStyle(won: number, pending: number) {
  if (won > 0) return { bg: CELL_BG_WON, text: CELL_TEXT_WON };
  if (pending > 0) return { bg: CELL_BG_PENDING, text: CELL_TEXT_PENDING };
  return { bg: CELL_BG_EMPTY, text: CELL_TEXT_EMPTY };
}

function getCellValue(won: number, pending: number): string {
  return `${won}(${pending})`;
}

export const HeatmapGrid: FC<HeatmapGridProps> = ({
  title,
  dayLabels,
  slotCount,
  cells,
}) => {
  const cellMap = new Map<string, HeatmapCellData>();
  for (const cell of cells) {
    cellMap.set(`${cell.eventDayId}:${cell.slotNumber}`, cell);
  }

  const slots = Array.from({ length: slotCount }, (_, i) => i + 1);

  return (
    <View className="mt-3">
      <Text className="text-sm font-semibold text-gray-700 mb-2">{title}</Text>
      <View>
        {/* ヘッダー行 */}
        <View className="flex-row">
          <View className="w-8" />
          {dayLabels.map((day) => {
            const dateColor =
              day.color === 'blue'
                ? 'text-blue-600'
                : day.color === 'red'
                  ? 'text-red-500'
                  : 'text-gray-600';
            return (
              <View key={day.id} className="flex-1 items-center px-0.5">
                <Text
                  className={`text-[10px] font-medium text-center leading-tight ${dateColor}`}
                >
                  {day.label}
                </Text>
                {day.subLabel && (
                  <Text className="text-[8px] text-gray-500 text-center leading-tight">
                    {day.subLabel}
                  </Text>
                )}
              </View>
            );
          })}
        </View>
        {/* データ行 */}
        {slots.map((slotNum) => (
          <View key={slotNum} className="flex-row mt-1">
            <View className="w-8 justify-center">
              <Text className="text-[10px] text-gray-600">{slotNum}部</Text>
            </View>
            {dayLabels.map((day) => {
              const cell = cellMap.get(`${day.id}:${slotNum}`);
              const won = cell?.won ?? 0;
              const pending = cell?.pending ?? 0;
              const style = getCellStyle(won, pending);
              const value = getCellValue(won, pending);

              return (
                <View
                  key={`${day.id}:${slotNum}`}
                  className={`flex-1 h-7 mx-0.5 rounded items-center justify-center ${style.bg}`}
                  accessibilityLabel={`${day.label} ${slotNum}部 当選${won} 申込中${pending}`}
                >
                  <Text className={`text-[10px] font-medium ${style.text}`}>
                    {value}
                  </Text>
                </View>
              );
            })}
          </View>
        ))}
      </View>
      <Text className="text-[10px] text-gray-400 mt-1">
        数値の見方: 当選(申込中)
      </Text>
    </View>
  );
};
