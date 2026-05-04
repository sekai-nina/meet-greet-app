import { useQuery } from '@tanstack/react-query';

import type { QueryData } from '@supabase/supabase-js';

import { supabase } from '@/lib/supabase';

const oshiMembersQuery = supabase
  .from('user_oshi_members')
  .select('*, members:member_id(*)');

export type OshiMemberWithDetail = QueryData<typeof oshiMembersQuery>[number];

export function useOshiMembers() {
  return useQuery({
    queryKey: ['oshi-members'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('user_oshi_members')
        .select('*, members:member_id(*)')
        .order('display_order', { ascending: true });
      if (error) throw error;
      return data;
    },
  });
}
