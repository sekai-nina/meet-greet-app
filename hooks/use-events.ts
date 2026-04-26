import { useQuery } from '@tanstack/react-query';

import { supabase } from '@/lib/supabase';
import type { EventWithDays, EventWithRelease } from '@/types';

export function useEvents() {
  return useQuery({
    queryKey: ['events'],
    queryFn: async (): Promise<EventWithRelease[]> => {
      const { data, error } = await supabase
        .from('events')
        .select('*, releases(*)')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as EventWithRelease[];
    },
  });
}

export function useEventDetail(eventId: string) {
  return useQuery({
    queryKey: ['events', eventId],
    queryFn: async (): Promise<EventWithDays> => {
      const { data, error } = await supabase
        .from('events')
        .select(
          `
          *,
          releases(*),
          event_days(
            *,
            event_slots(*),
            event_day_members(*, members(*))
          )
        `,
        )
        .eq('id', eventId)
        .single();

      if (error) throw error;
      return data as EventWithDays;
    },
    enabled: !!eventId,
  });
}
