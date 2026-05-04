import { useQuery } from '@tanstack/react-query';

import { supabase } from '@/lib/supabase';

export type HeatmapCell = {
  eventDayId: string;
  slotNumber: number;
  won: number;
  pending: number;
};

export function useParticipationHeatmap(
  releaseId: string | undefined,
  memberId: string | null,
) {
  return useQuery({
    queryKey: ['participation-heatmap', releaseId, memberId],
    queryFn: async () => {
      let query = supabase.from('v_participation_status').select('*');

      if (memberId) {
        query = query.eq('member_id', memberId);
      }

      const { data, error } = await query;
      if (error) throw error;
      if (!data?.length) return [];

      // リリースIDでフィルター
      const eventIds = [...new Set(data.map((d) => d.event_id))];
      const { data: events, error: eventsError } = await supabase
        .from('events')
        .select('id, release_id')
        .in('id', eventIds)
        .eq('release_id', releaseId!);
      if (eventsError) throw eventsError;

      const releaseEventIds = new Set(events?.map((e) => e.id) ?? []);
      const filtered = data.filter((d) => releaseEventIds.has(d.event_id));

      // (event_day_id, slot_number) でグルーピングして won / pending を集計
      const cellMap = new Map<string, HeatmapCell>();

      for (const row of filtered) {
        const key = `${row.event_day_id}:${row.slot_number}`;
        const existing = cellMap.get(key);
        if (existing) {
          existing.won += row.total_won;
          existing.pending += row.pending_count;
        } else {
          cellMap.set(key, {
            eventDayId: row.event_day_id,
            slotNumber: row.slot_number,
            won: row.total_won,
            pending: row.pending_count,
          });
        }
      }

      return [...cellMap.values()];
    },
    enabled: !!releaseId,
  });
}
