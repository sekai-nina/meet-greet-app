import { Stack } from 'expo-router';

import { BackButton } from '@/components/BackButton';

export default function HomeLayout() {
  return (
    <Stack
      screenOptions={{
        headerBackTitle: '戻る',
        headerLeft: () => <BackButton />,
      }}
    >
      <Stack.Screen name="event-detail" options={{ title: '日程詳細' }} />
      <Stack.Screen name="apply-type" options={{ title: '申込み登録' }} />
      <Stack.Screen name="apply-regular" options={{ title: '申込み登録' }} />
      <Stack.Screen name="apply-limited" options={{ title: '申込み登録' }} />
      <Stack.Screen name="confirm-regular" options={{ title: '計画の確認' }} />
      <Stack.Screen name="confirm-limited" options={{ title: '計画の確認' }} />
    </Stack>
  );
}
