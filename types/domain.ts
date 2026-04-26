import type { Database } from './database.types';

// -- Table row type aliases --
type Tables = Database['public']['Tables'];

export type Release = Tables['releases']['Row'];
export type Member = Tables['members']['Row'];
export type ReleaseCenter = Tables['release_centers']['Row'];
export type Event = Tables['events']['Row'];
export type EventDay = Tables['event_days']['Row'];
export type EventSlot = Tables['event_slots']['Row'];
export type EventDayMember = Tables['event_day_members']['Row'];

// -- Union types (enums) --
export type ReleaseType = 'single' | 'album';
export type EventFormat = 'online' | 'offline';

// -- Composite types for UI --
export type EventWithRelease = Event & {
  releases: Release;
};

export type EventDayWithDetails = EventDay & {
  event_slots: EventSlot[];
  event_day_members: (EventDayMember & {
    members: Member;
  })[];
};

export type EventWithDays = Event & {
  releases: Release;
  event_days: EventDayWithDetails[];
};
