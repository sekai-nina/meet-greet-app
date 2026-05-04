-- =============================================================
-- 登録 (registration) テーブル: 申込み登録のスナップショット
--
-- round_applications は最新の集約状態 (UPSERT)
-- registrations + registration_items は登録ごとの履歴 (INSERT のみ)
-- =============================================================

-- -------------------------------------------------------------
-- registrations (登録イベント)
-- -------------------------------------------------------------
create table registrations (
  id                 uuid        primary key default gen_random_uuid(),
  user_id            uuid        not null references auth.users(id) on delete cascade,
  reception_round_id uuid        not null references reception_rounds(id) on delete restrict,
  created_at         timestamptz not null default now()
);

create index idx_registrations_user_id on registrations (user_id);
create index idx_registrations_user_round on registrations (user_id, reception_round_id);

-- -------------------------------------------------------------
-- registration_items (登録内容のスナップショット)
-- -------------------------------------------------------------
create table registration_items (
  id              uuid        primary key default gen_random_uuid(),
  registration_id uuid        not null references registrations(id) on delete cascade,
  event_slot_id   uuid        not null references event_slots(id) on delete restrict,
  member_id       uuid        not null references members(id) on delete restrict,
  applied_count   smallint    not null check (applied_count >= 1),
  created_at      timestamptz not null default now()
);

create index idx_registration_items_registration_id on registration_items (registration_id);

-- -------------------------------------------------------------
-- registration_rates (登録ごとの予想当選割合)
-- -------------------------------------------------------------
create table registration_rates (
  id              uuid        primary key default gen_random_uuid(),
  registration_id uuid        not null references registrations(id) on delete cascade,
  member_id       uuid        not null references members(id) on delete restrict,
  expected_win_rate smallint  not null check (expected_win_rate >= 0 and expected_win_rate <= 100),
  created_at      timestamptz not null default now(),
  constraint uq_registration_rates unique (registration_id, member_id)
);

-- -------------------------------------------------------------
-- RLS: 本人のみ CRUD
-- -------------------------------------------------------------
alter table registrations enable row level security;
alter table registration_items enable row level security;
alter table registration_rates enable row level security;

create policy "registrations_select_own" on registrations for select using (auth.uid() = user_id);
create policy "registrations_insert_own" on registrations for insert with check (auth.uid() = user_id);

create policy "registration_items_select_own" on registration_items
  for select using (exists (select 1 from registrations r where r.id = registration_id and r.user_id = auth.uid()));
create policy "registration_items_insert_own" on registration_items
  for insert with check (exists (select 1 from registrations r where r.id = registration_id and r.user_id = auth.uid()));

create policy "registration_rates_select_own" on registration_rates
  for select using (exists (select 1 from registrations r where r.id = registration_id and r.user_id = auth.uid()));
create policy "registration_rates_insert_own" on registration_rates
  for insert with check (exists (select 1 from registrations r where r.id = registration_id and r.user_id = auth.uid()));
