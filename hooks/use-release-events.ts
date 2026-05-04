import { useQuery } from '@tanstack/react-query';

import type { QueryData } from '@supabase/supabase-js';

import { supabase } from '@/lib/supabase';

const releaseEventsQuery = (releaseId: string) =>
  supabase
    .from('events')
    .select('*, event_days(*, event_slots(*))')
    .eq('release_id', releaseId)
    .order('format');

export type ReleaseEventWithDays = QueryData<
  ReturnType<typeof releaseEventsQuery>
>[number];

export function useReleaseEvents(releaseId: string | undefined) {
  return useQuery({
    queryKey: ['release-events', releaseId],
    queryFn: async () => {
      const { data, error } = await releaseEventsQuery(releaseId!);
      if (error) throw error;
      return data;
    },
    enabled: !!releaseId,
  });
}
