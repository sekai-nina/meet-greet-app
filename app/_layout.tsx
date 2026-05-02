import '../global.css';

import { useEffect } from 'react';

import { Slot, useRouter, useSegments } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';

import { QueryClientProvider } from '@tanstack/react-query';

import { useAuth } from '@/hooks/use-auth';
import { queryClient } from '@/lib/query-client';
import { useAuthStore } from '@/stores/auth-store';

SplashScreen.preventAutoHideAsync().catch(() => {});

function AuthGate() {
  const { isAuthenticated, isInitialized } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (!isInitialized) return;

    SplashScreen.hideAsync().catch(() => {});

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
  useEffect(() => {
    useAuthStore.getState().initialize();
    return () => useAuthStore.getState().dispose();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <AuthGate />
    </QueryClientProvider>
  );
}
