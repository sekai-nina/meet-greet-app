import type { Database } from './database.types';

// -- Table row type aliases --
type Tables = Database['public']['Tables'];
type Views = Database['public']['Views'];

export type Release = Tables['releases']['Row'];
export type Member = Tables['members']['Row'];
export type ReleaseCenter = Tables['release_centers']['Row'];
export type Event = Tables['events']['Row'];
export type EventDay = Tables['event_days']['Row'];
export type EventSlot = Tables['event_slots']['Row'];
export type EventDayMember = Tables['event_day_members']['Row'];
export type ReceptionRound = Tables['reception_rounds']['Row'];
export type ReceptionRoundTarget = Tables['reception_round_targets']['Row'];
export type RoundApplication = Tables['round_applications']['Row'];
export type RoundApplicationRate = Tables['round_application_rates']['Row'];
export type AttendanceRecord = Tables['attendance_records']['Row'];
export type UserOshiMember = Tables['user_oshi_members']['Row'];

// -- View row type aliases --
export type ParticipationStatusRow = Views['v_participation_status']['Row'];
export type UserReleaseSummaryRow = Views['v_user_release_summary']['Row'];

// -- Union types --
// DB の CHECK 制約と同期すること
export type ReleaseType = 'single' | 'album';
export type EventFormat = 'regular_online' | 'limited_online' | 'real';
export type CdType = 'regular' | 'limited';
export type ParticipationStatus = 'won' | 'applied' | 'lost';
export type AttendanceStatus = 'attended' | 'cancelled';
