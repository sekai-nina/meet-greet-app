import { ActivityIndicator, FlatList, Text, TouchableOpacity, View } from 'react-native';

import { useLocalSearchParams } from 'expo-router';

import { EventDayCard } from '@/components/EventDayCard';
import { useEventDetail } from '@/hooks/use-events';

const FORMAT_LABELS: Record<string, string> = {
  online: 'オンライン',
  offline: 'オフライン',
};

export default function EventDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: event, isLoading, error, refetch } = useEventDetail(id);

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" />
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
          className="bg-blue-600 rounded-lg px-6 py-3"
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
      className="flex-1 bg-gray-50"
      contentContainerStyle={{ padding: 16 }}
      data={sortedDays}
      keyExtractor={(item) => item.id}
      ListHeaderComponent={
        <View className="mb-4">
          <Text className="text-2xl font-bold">{event.releases.title}</Text>
          <View className="flex-row items-center mt-2">
            <View className="bg-blue-100 rounded-full px-3 py-1">
              <Text className="text-xs text-blue-800 font-medium">
                {FORMAT_LABELS[event.format] ?? event.format}
              </Text>
            </View>
            <Text className="text-sm text-gray-500 ml-3">
              {sortedDays.length}日程
            </Text>
          </View>
        </View>
      }
      renderItem={({ item }) => <EventDayCard eventDay={item} />}
    />
  );
}
