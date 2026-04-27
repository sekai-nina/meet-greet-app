import { ActivityIndicator, FlatList, Text, TouchableOpacity, View } from 'react-native';

import { useRouter } from 'expo-router';

import type { EventWithRelease } from '@/hooks/use-events';
import { useEvents } from '@/hooks/use-events';

const FORMAT_LABELS: Record<string, string> = {
  online: 'オンライン',
  offline: 'オフライン',
};

export default function EventsTab() {
  const { data: events, isLoading, error, refetch } = useEvents();
  const router = useRouter();

  const handlePress = (event: EventWithRelease) => {
    router.navigate(`/(app)/events/${event.id}`);
  };

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (error) {
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

  if (!events?.length) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <Text className="text-gray-500">イベントがありません</Text>
      </View>
    );
  }

  return (
    <FlatList
      className="flex-1 bg-gray-50"
      contentContainerStyle={{ padding: 16 }}
      data={events}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <TouchableOpacity
          className="bg-white rounded-xl border border-gray-200 p-4 mb-3"
          onPress={() => handlePress(item)}
          accessibilityRole="button"
          accessibilityLabel={`${item.releases.title} ${FORMAT_LABELS[item.format] ?? item.format}`}
        >
          <Text className="text-lg font-bold">{item.releases.title}</Text>
          <View className="flex-row items-center mt-2">
            <View className="bg-blue-100 rounded-full px-3 py-1">
              <Text className="text-xs text-blue-800 font-medium">
                {FORMAT_LABELS[item.format] ?? item.format}
              </Text>
            </View>
            {item.releases.release_date && (
              <Text className="text-sm text-gray-500 ml-3">
                {item.releases.release_date}
              </Text>
            )}
          </View>
        </TouchableOpacity>
      )}
    />
  );
}
