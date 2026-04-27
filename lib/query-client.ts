import { QueryClient } from '@tanstack/react-query';

const STALE_TIME_MS = 5 * 60 * 1000; // 5 minutes
const RETRY_COUNT = 2;

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: STALE_TIME_MS,
      retry: RETRY_COUNT,
    },
  },
});
