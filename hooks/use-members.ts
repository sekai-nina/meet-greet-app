import { useQuery } from '@tanstack/react-query';

import { supabase } from '@/lib/supabase';

export function useMembers() {
  return useQuery({
    queryKey: ['members'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('members')
        .select('*')
        .order('generation', { ascending: true })
        .order('name', { ascending: true });
      if (error) throw error;
      return data;
    },
  });
}
