import { useQuery } from '@tanstack/react-query';

import { supabase } from '@/lib/supabase';

export type PopularityLevel = 'sold_out' | 'busy' | 'slightly_busy' | 'available' | 'no_data';

export const POPULARITY_SYMBOL: Record<PopularityLevel, string> = {
  sold_out: '×',
  busy: '△',
  slightly_busy: '○',
  available: '◎',
  no_data: '—',
};

export const POPULARITY_LABEL: Record<PopularityLevel, string> = {
  sold_out: '完売',
  busy: '混雑',
  slightly_busy: 'やや混雑',
  available: '余裕あり',
  no_data: '',
};

type SlotPopularity = {
  eventSlotId: string;
  eventDayId: string;
  slotNumber: number;
  level: PopularityLevel;
  symbol: string;
};

export function useSlotPopularity(
  eventId: string | undefined,
  memberId: string | null,
) {
  return useQuery({
    queryKey: ['slot-popularity', eventId, memberId],
    queryFn: async (): Promise<SlotPopularity[]> => {
      const { data, error } = await supabase.rpc('get_slot_popularity', {
        p_event_id: eventId!,
        p_member_id: memberId!,
      });
      if (error) throw error;

      const VALID_LEVELS: Set<string> = new Set([
        'sold_out', 'busy', 'slightly_busy', 'available', 'no_data',
      ]);

      return (data ?? []).map((row) => {
        const level: PopularityLevel = VALID_LEVELS.has(row.popularity_level)
          ? (row.popularity_level as PopularityLevel)
          : 'no_data';
        return {
          eventSlotId: row.event_slot_id,
          eventDayId: row.event_day_id,
          slotNumber: row.slot_number,
          level,
          symbol: POPULARITY_SYMBOL[level],
        };
      });
    },
    enabled: !!eventId && !!memberId,
  });
}
