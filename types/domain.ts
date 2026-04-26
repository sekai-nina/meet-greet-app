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

// -- Union types --
// DB の CHECK 制約と同期すること (releases.release_type, events.format)
export type ReleaseType = 'single' | 'album';
export type EventFormat = 'online' | 'offline';
