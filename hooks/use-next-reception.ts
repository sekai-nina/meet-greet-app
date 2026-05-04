import { useQuery } from '@tanstack/react-query';

import type { QueryData } from '@supabase/supabase-js';

import { supabase } from '@/lib/supabase';

const nextReceptionQuery = (releaseId: string) =>
  supabase
    .from('reception_rounds')
    .select('*, events!inner(*, releases!inner(*))')
    .eq('events.release_id', releaseId)
    .gt('end_at', new Date().toISOString())
    .order('start_at', { ascending: true })
    .limit(1)
    .maybeSingle();

export type ReceptionRoundWithEvent = NonNullable<
  QueryData<ReturnType<typeof nextReceptionQuery>>
>;

export function useNextReception(releaseId: string | undefined) {
  return useQuery({
    queryKey: ['next-reception', releaseId],
    queryFn: async () => {
      const { data, error } = await nextReceptionQuery(releaseId!);
      if (error) throw error;
      return data;
    },
    enabled: !!releaseId,
  });
}
