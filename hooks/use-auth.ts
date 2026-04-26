import { useAuthStore } from '@/stores/auth-store';

export function useAuth() {
  const session = useAuthStore((s) => s.session);
  const isLoading = useAuthStore((s) => s.isLoading);
  const isInitialized = useAuthStore((s) => s.isInitialized);

  return {
    session,
    user: session?.user ?? null,
    isAuthenticated: session !== null,
    isAnonymous: session?.user?.is_anonymous ?? false,
    isLoading,
    isInitialized,
  };
}
