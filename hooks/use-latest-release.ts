import { useQuery } from '@tanstack/react-query';

import { supabase } from '@/lib/supabase';

export function useLatestRelease() {
  return useQuery({
    queryKey: ['releases', 'latest'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('releases')
        .select('*')
        .order('release_date', { ascending: false, nullsFirst: false })
        .limit(1)
        .single();
      if (error) throw error;
      return data;
    },
  });
}
