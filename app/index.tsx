import { Redirect } from 'expo-router';

import { useAuth } from '@/hooks/use-auth';

export default function Index() {
  const { isAuthenticated, isInitialized } = useAuth();

  if (!isInitialized) return null;

  if (isAuthenticated) {
    return <Redirect href="/(app)/(tabs)" />;
  }

  return <Redirect href="/(auth)/login" />;
}
