import { useQuery } from '@tanstack/react-query';

import { supabase } from '@/lib/supabase';

type AppliedMember = {
  id: string;
  name: string;
};

export function useAppliedMembers(releaseId: string | undefined) {
  return useQuery({
    queryKey: ['applied-members', releaseId],
    queryFn: async (): Promise<AppliedMember[]> => {
      // v_participation_status から申込み済みの member_id を取得
      const { data: statusData, error: statusError } = await supabase
        .from('v_participation_status')
        .select('member_id, event_id');
      if (statusError) throw statusError;
      if (!statusData?.length) return [];

      // リリースに紐づくイベントでフィルター
      const eventIds = [...new Set(statusData.map((s) => s.event_id))];
      const { data: events, error: eventsError } = await supabase
        .from('events')
        .select('id')
        .in('id', eventIds)
        .eq('release_id', releaseId!);
      if (eventsError) throw eventsError;

      const releaseEventIds = new Set(events?.map((e) => e.id) ?? []);
      const memberIds = [
        ...new Set(
          statusData
            .filter((s) => releaseEventIds.has(s.event_id))
            .map((s) => s.member_id),
        ),
      ];

      if (memberIds.length === 0) return [];

      // メンバー名を取得
      const { data: members, error: membersError } = await supabase
        .from('members')
        .select('id, name')
        .in('id', memberIds);
      if (membersError) throw membersError;

      return (members ?? []).map((m) => ({ id: m.id, name: m.name }));
    },
    enabled: !!releaseId,
  });
}
