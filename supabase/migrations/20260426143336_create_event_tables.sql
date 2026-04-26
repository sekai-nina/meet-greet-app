-- =============================================================
-- M1 #14: イベント系テーブル
-- (events, event_days, event_slots, event_day_members)
-- =============================================================

-- -------------------------------------------------------------
-- events (ミーグリイベント)
-- -------------------------------------------------------------
create table events (
  id         uuid        primary key default gen_random_uuid(),
  release_id uuid        not null references releases(id) on delete restrict,
  format     text        not null check (format in ('online', 'offline')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index idx_events_release_id on events (release_id);

create trigger trg_events_updated_at
  before update on events
  for each row execute function set_updated_at();

-- -------------------------------------------------------------
-- event_days (開催日)
-- -------------------------------------------------------------
create table event_days (
  id         uuid        primary key default gen_random_uuid(),
  event_id   uuid        not null references events(id) on delete restrict,
  day_number int         not null check (day_number > 0),
  date       date        not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint uq_event_days_event_id_day_number unique (event_id, day_number),
  constraint uq_event_days_event_id_date unique (event_id, date)
);

create trigger trg_event_days_updated_at
  before update on event_days
  for each row execute function set_updated_at();

-- -------------------------------------------------------------
-- event_slots (部 / 時間帯スロット)
-- -------------------------------------------------------------
create table event_slots (
  id           uuid        primary key default gen_random_uuid(),
  event_day_id uuid        not null references event_days(id) on delete restrict,
  slot_number  int         not null check (slot_number > 0),
  starts_at    timestamptz not null,
  ends_at      timestamptz not null,
  constraint chk_event_slots_time_range check (ends_at > starts_at),
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now(),
  constraint uq_event_slots_event_day_id_slot_number unique (event_day_id, slot_number)
);

create trigger trg_event_slots_updated_at
  before update on event_slots
  for each row execute function set_updated_at();

-- -------------------------------------------------------------
-- event_day_members (開催日 × 出演メンバー)
-- -------------------------------------------------------------
create table event_day_members (
  event_day_id uuid        not null references event_days(id) on delete restrict,
  member_id    uuid        not null references members(id) on delete restrict,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now(),
  primary key (event_day_id, member_id)
);

create trigger trg_event_day_members_updated_at
  before update on event_day_members
  for each row execute function set_updated_at();

-- -------------------------------------------------------------
-- RLS: イベントデータは全員読み取り可能
-- -------------------------------------------------------------
alter table events enable row level security;
alter table event_days enable row level security;
alter table event_slots enable row level security;
alter table event_day_members enable row level security;

create policy "events_select_all" on events for select using (true);
create policy "event_days_select_all" on event_days for select using (true);
create policy "event_slots_select_all" on event_slots for select using (true);
create policy "event_day_members_select_all" on event_day_members for select using (true);
