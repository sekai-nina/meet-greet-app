import { Redirect, Stack } from 'expo-router';

import { useAuth } from '@/hooks/use-auth';

export default function AppLayout() {
  const { isAuthenticated, isInitialized } = useAuth();

  if (!isInitialized) return null;

  if (!isAuthenticated) {
    return <Redirect href="/(auth)/login" />;
  }

  return (
    <Stack screenOptions={{ headerBackTitle: '戻る' }}>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen
        name="events/[id]"
        options={{ title: 'イベント詳細' }}
      />
      <Stack.Screen name="home" options={{ headerShown: false }} />
    </Stack>
  );
}
