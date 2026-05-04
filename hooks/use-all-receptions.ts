import { useQuery } from '@tanstack/react-query';

import type { QueryData } from '@supabase/supabase-js';

import { supabase } from '@/lib/supabase';

const allReceptionsQuery = (releaseId: string) =>
  supabase
    .from('reception_rounds')
    .select('*, events!inner(id, format, release_id)')
    .eq('events.release_id', releaseId)
    .order('round_number', { ascending: true });

export type ReceptionRoundWithEvent = QueryData<
  ReturnType<typeof allReceptionsQuery>
>[number];

export function useAllReceptions(releaseId: string | undefined) {
  return useQuery({
    queryKey: ['all-receptions', releaseId],
    queryFn: async () => {
      const { data, error } = await allReceptionsQuery(releaseId!);
      if (error) throw error;
      return data;
    },
    enabled: !!releaseId,
  });
}
