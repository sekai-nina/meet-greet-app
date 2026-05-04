import '../global.css';

import { useEffect } from 'react';
import Constants from 'expo-constants';
import { ActivityIndicator, View } from 'react-native'; // eslint-disable-line no-restricted-imports -- フォント読み込み前のため LoadingSpinner は使用不可
import { Slot, useRouter, useSegments } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';

import { QueryClientProvider } from '@tanstack/react-query';

import { useFonts } from '@expo-google-fonts/plus-jakarta-sans';
import { PlusJakartaSans_400Regular } from '@expo-google-fonts/plus-jakarta-sans/400Regular';
import { PlusJakartaSans_500Medium } from '@expo-google-fonts/plus-jakarta-sans/500Medium';
import { PlusJakartaSans_600SemiBold } from '@expo-google-fonts/plus-jakarta-sans/600SemiBold';
import { PlusJakartaSans_700Bold } from '@expo-google-fonts/plus-jakarta-sans/700Bold';
import { PlusJakartaSans_800ExtraBold } from '@expo-google-fonts/plus-jakarta-sans/800ExtraBold';
import { Murecho_400Regular } from '@expo-google-fonts/murecho/400Regular';
import { Murecho_500Medium } from '@expo-google-fonts/murecho/500Medium';
import { Murecho_700Bold } from '@expo-google-fonts/murecho/700Bold';

import { useAuth } from '@/hooks/use-auth';
import { queryClient } from '@/lib/query-client';
import { useAuthStore } from '@/stores/auth-store';

// Expo Go では SplashScreen が未登録のため呼び出さない。
const isExpoGo = Constants.appOwnership === 'expo';
if (!isExpoGo) {
  void SplashScreen.preventAutoHideAsync().catch(() => {});
}

function AuthGate() {
  const { isAuthenticated, isInitialized } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (!isInitialized) return;

    if (!isExpoGo) {
      void SplashScreen.hideAsync().catch(() => {});
    }

    const rootSegment = segments[0];
    const isInAuthGroup = rootSegment === '(auth)';

    if (!isAuthenticated && !isInAuthGroup) {
      router.replace('/(auth)/login');
    } else if (isAuthenticated && isInAuthGroup) {
      router.replace('/(app)/(tabs)');
    }
  }, [isAuthenticated, isInitialized, segments, router]);

  return <Slot />;
}

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    PlusJakartaSans_400Regular,
    PlusJakartaSans_500Medium,
    PlusJakartaSans_600SemiBold,
    PlusJakartaSans_700Bold,
    PlusJakartaSans_800ExtraBold,
    Murecho_400Regular,
    Murecho_500Medium,
    Murecho_700Bold,
  });

  useEffect(() => {
    useAuthStore.getState().initialize();
    return () => useAuthStore.getState().dispose();
  }, []);

  if (!fontsLoaded && !fontError) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator size="large" color="#5BBEE5" />
      </View>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <AuthGate />
    </QueryClientProvider>
  );
}
