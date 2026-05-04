import { FlatList, Text, TouchableOpacity, View } from 'react-native';

import { useLocalSearchParams } from 'expo-router';

import { EventDayCard } from '@/components/EventDayCard';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { FORMAT_LABELS } from '@/lib/format-labels';
import { useEventDetail } from '@/hooks/use-events';

export default function EventDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: event, isLoading, error, refetch } = useEventDetail(id);

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <LoadingSpinner />
      </View>
    );
  }

  if (error || !event) {
    return (
      <View className="flex-1 items-center justify-center bg-white px-6">
        <Text className="text-red-600 text-center mb-4">
          データの取得に失敗しました
        </Text>
        <TouchableOpacity
          className="bg-primary rounded-lg px-6 py-3"
          onPress={() => void refetch()}
        >
          <Text className="text-white font-semibold">再試行</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const sortedDays = [...event.event_days].sort(
    (a, b) => a.day_number - b.day_number,
  );

  return (
    <FlatList
      className="flex-1 bg-bg"
      contentContainerStyle={{ padding: 16 }}
      data={sortedDays}
      keyExtractor={(item) => item.id}
      ListHeaderComponent={
        <View className="mb-4">
          <Text className="text-2xl font-bold">{event.releases.title}</Text>
          <View className="flex-row items-center mt-2">
            <View className="bg-primary-soft rounded-full px-3 py-1">
              <Text className="text-xs text-text font-medium">
                {FORMAT_LABELS[event.format] ?? event.format}
              </Text>
            </View>
            <Text className="text-sm text-text-muted ml-3">
              {sortedDays.length}日程
            </Text>
          </View>
        </View>
      }
      renderItem={({ item }) => <EventDayCard eventDay={item} />}
    />
  );
}
