import type { FC } from 'react';
import { useState } from 'react';

import { Text, TouchableOpacity, View } from 'react-native';

import { MemberChip } from '@/components/MemberChip';
import type { EventWithDays } from '@/hooks/use-events';

type EventDayWithDetails = EventWithDays['event_days'][number];

type Props = {
  eventDay: EventDayWithDetails;
};

const jstFormatter = new Intl.DateTimeFormat('ja-JP', {
  hour: '2-digit',
  minute: '2-digit',
  timeZone: 'Asia/Tokyo',
  hour12: false,
});

const formatTime = (isoString: string): string => {
  return jstFormatter.format(new Date(isoString));
};

export const EventDayCard: FC<Props> = ({ eventDay }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const sortedSlots = [...eventDay.event_slots].sort(
    (a, b) => a.slot_number - b.slot_number,
  );
  const members = eventDay.event_day_members.map((edm) => edm.members);

  return (
    <View className="bg-white rounded-xl border border-border p-4 mb-3">
      <TouchableOpacity
        onPress={() => setIsExpanded(!isExpanded)}
        accessibilityRole="button"
        accessibilityLabel={`DAY${eventDay.day_number} ${eventDay.date} ${isExpanded ? '折りたたむ' : '展開する'}`}
        accessibilityState={{ expanded: isExpanded }}
      >
        <View className="flex-row justify-between items-center">
          <View>
            <Text className="text-lg font-bold">
              DAY{eventDay.day_number}
            </Text>
            <Text className="text-sm text-text-muted mt-1">
              {eventDay.date}
            </Text>
          </View>
          <View className="flex-row items-center">
            <Text className="text-sm text-text-muted mr-2">
              {sortedSlots.length}部 / {members.length}名
            </Text>
            <Text className="text-gray-400">
              {isExpanded ? '▲' : '▼'}
            </Text>
          </View>
        </View>
      </TouchableOpacity>

      {isExpanded && (
        <View className="mt-4">
          <Text className="text-sm font-semibold text-text mb-2">
            部
          </Text>
          {sortedSlots.map((slot) => (
            <View
              key={slot.id}
              className="flex-row justify-between py-2 border-b border-divider"
            >
              <Text className="text-sm">第{slot.slot_number}部</Text>
              <Text className="text-sm text-text-muted">
                {formatTime(slot.starts_at)}〜{formatTime(slot.ends_at)}
              </Text>
            </View>
          ))}

          <Text className="text-sm font-semibold text-text mt-4 mb-2">
            出演メンバー
          </Text>
          <View className="flex-row flex-wrap">
            {members.map((member) => (
              <MemberChip key={member.id} member={member} />
            ))}
          </View>
        </View>
      )}
    </View>
  );
};
