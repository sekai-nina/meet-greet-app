import { useQuery } from '@tanstack/react-query';

import { supabase } from '@/lib/supabase';

export function useReleaseSummary(releaseId: string | undefined) {
  return useQuery({
    queryKey: ['release-summary', releaseId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('v_user_release_summary')
        .select('*')
        .eq('release_id', releaseId!)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
    enabled: !!releaseId,
  });
}
