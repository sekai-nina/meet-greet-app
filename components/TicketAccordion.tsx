import { useState } from 'react';
import type { FC } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

import { FORMAT_LABELS, FORMAT_ORDER } from '@/lib/format-labels';

export type TicketRow = {
  id: string;
  date: string;
  dayNumber: number;
  slotNumber: number;
  timeRange: string;
  memberName: string;
  format: string;
  count: number;
};

type TicketAccordionProps = {
  totalWon: number;
  tickets: TicketRow[];
};

function groupByFormat(tickets: TicketRow[]): [string, TicketRow[]][] {
  const map = new Map<string, TicketRow[]>();
  for (const ticket of tickets) {
    const existing = map.get(ticket.format);
    if (existing) {
      existing.push(ticket);
    } else {
      map.set(ticket.format, [ticket]);
    }
  }
  // FORMAT_ORDER の順にソート
  return [...map.entries()].sort(
    (a, b) =>
      (FORMAT_ORDER.indexOf(a[0]) === -1 ? 999 : FORMAT_ORDER.indexOf(a[0])) -
      (FORMAT_ORDER.indexOf(b[0]) === -1 ? 999 : FORMAT_ORDER.indexOf(b[0])),
  );
}

export const TicketAccordion: FC<TicketAccordionProps> = ({
  totalWon,
  tickets,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const grouped = groupByFormat(tickets);

  return (
    <View className="mx-4 mt-4">
      <TouchableOpacity
        className="flex-row items-center justify-between rounded-xl border border-border bg-white p-4"
        onPress={() => setIsExpanded(!isExpanded)}
        accessibilityRole="button"
        accessibilityLabel={`チケット情報 当選${totalWon}枚`}
        accessibilityState={{ expanded: isExpanded }}
      >
        <Text className="text-lg font-bold text-text">チケット情報</Text>
        <View className="flex-row items-center">
          <View className="rounded-full bg-green-100 px-2.5 py-0.5 mr-2">
            <Text className="text-xs font-medium text-green-800">
              当選 {totalWon}枚
            </Text>
          </View>
          <Text className="text-gray-400">{isExpanded ? '▲' : '▼'}</Text>
        </View>
      </TouchableOpacity>

      {isExpanded && (
        <View className="rounded-b-xl border border-t-0 border-border bg-white px-4 pb-4">
          {tickets.length === 0 ? (
            <Text className="text-sm text-text-muted text-center py-3">
              当選チケットはありません
            </Text>
          ) : (
            grouped.map(([format, rows]) => (
              <View key={format} className="mt-3">
                <Text className="text-sm font-semibold text-gray-700 mb-2">
                  {FORMAT_LABELS[format] ?? format} ({rows.reduce((sum, r) => sum + r.count, 0)}枚)
                </Text>
                {/* ヘッダー行 */}
                <View className="flex-row items-center py-1.5 border-b border-border">
                  <Text className="text-[10px] font-medium text-text-muted w-16">日付</Text>
                  <Text className="text-[10px] font-medium text-text-muted w-10">部</Text>
                  <Text className="text-[10px] font-medium text-text-muted flex-1">時間</Text>
                  <Text className="text-[10px] font-medium text-text-muted w-20 text-right">メンバー</Text>
                  <Text className="text-[10px] font-medium text-text-muted w-8 text-right">枚数</Text>
                </View>
                {rows.map((row) => (
                  <View
                    key={row.id}
                    className="flex-row items-center py-2 border-b border-divider"
                  >
                    <Text className="text-xs text-gray-600 w-16">
                      {row.date}
                    </Text>
                    <Text className="text-xs text-gray-600 w-10">
                      {row.slotNumber}部
                    </Text>
                    <Text className="text-[10px] text-text-muted flex-1">
                      {row.timeRange}
                    </Text>
                    <Text className="text-xs text-text font-medium w-20 text-right">
                      {row.memberName}
                    </Text>
                    <Text className="text-xs text-text font-bold w-8 text-right">
                      {row.count}
                    </Text>
                  </View>
                ))}
              </View>
            ))
          )}
        </View>
      )}
    </View>
  );
};
