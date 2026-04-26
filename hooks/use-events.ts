import type { QueryData } from '@supabase/supabase-js';
import { useQuery } from '@tanstack/react-query';

import { supabase } from '@/lib/supabase';

const eventsQuery = supabase
  .from('events')
  .select('*, releases(*)');

const eventDetailQuery = (eventId: string) =>
  supabase
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

export type EventWithRelease = QueryData<typeof eventsQuery>[number];
export type EventWithDays = QueryData<ReturnType<typeof eventDetailQuery>>;

export function useEvents() {
  return useQuery({
    queryKey: ['events'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('events')
        .select('*, releases(*)')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
  });
}

export function useEventDetail(eventId: string) {
  return useQuery({
    queryKey: ['events', eventId],
    queryFn: async () => {
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
      return data;
    },
    enabled: !!eventId,
  });
}
