import { View, Text } from 'react-native';

export default function HomeScreen() {
  return (
    <View className="flex-1 items-center justify-center bg-white">
      <Text className="text-2xl font-bold text-gray-800">ミーグリ記録</Text>
      <Text className="mt-2 text-base text-gray-500">日向坂46 ミート&グリート管理アプリ</Text>
      <Text className="mt-4 text-sm text-gray-400">ひよたんかわいい</Text>
    </View>
  );
}
