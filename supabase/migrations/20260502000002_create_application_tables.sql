-- =============================================================
-- H1 に必要な新テーブル・ビューを作成
-- =============================================================

-- -------------------------------------------------------------
-- reception_rounds (受付次)
-- -------------------------------------------------------------
create table reception_rounds (
  id               uuid        primary key default gen_random_uuid(),
  event_id         uuid        not null references events(id) on delete restrict,
  round_number     smallint    not null check (round_number > 0),
  start_at         timestamptz not null,
  end_at           timestamptz not null,
  max_applications smallint    not null check (max_applications > 0),
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now(),
  constraint chk_reception_rounds_time_range check (end_at > start_at),
  constraint uq_reception_rounds_event_id_round_number unique (event_id, round_number)
);

create index idx_reception_rounds_event_id on reception_rounds (event_id);

create trigger trg_reception_rounds_updated_at
  before update on reception_rounds
  for each row execute function set_updated_at();

-- -------------------------------------------------------------
-- reception_round_targets (受付次の対象日程)
-- -------------------------------------------------------------
create table reception_round_targets (
  reception_round_id uuid    not null references reception_rounds(id) on delete restrict,
  event_day_id       uuid    not null references event_days(id) on delete restrict,
  is_final_round     boolean not null default false,
  created_at         timestamptz not null default now(),
  primary key (reception_round_id, event_day_id)
);

-- -------------------------------------------------------------
-- user_oshi_members (推しメン)
-- -------------------------------------------------------------
create table user_oshi_members (
  user_id       uuid     not null references auth.users(id) on delete cascade,
  member_id     uuid     not null references members(id) on delete restrict,
  display_order smallint not null default 1,
  created_at    timestamptz not null default now(),
  primary key (user_id, member_id)
);

create index idx_user_oshi_members_user_id on user_oshi_members (user_id);

-- -------------------------------------------------------------
-- round_applications (受付次別の申込・当落)
-- ⚠️ CRITICAL TODO (v2): reception_round_id のイベントと event_slot_id のイベントが一致することを
-- DB レベルで保証する仕組み (複合FK、トリガー、またはDB関数) を追加する。
-- v1 ではアプリ側のバリデーションに依存。改造クライアントから不正データ登録が可能。
-- -------------------------------------------------------------
create table round_applications (
  id                 uuid        primary key default gen_random_uuid(),
  user_id            uuid        not null references auth.users(id) on delete cascade,
  reception_round_id uuid        not null references reception_rounds(id) on delete restrict,
  event_slot_id      uuid        not null references event_slots(id) on delete restrict,
  member_id          uuid        not null references members(id) on delete restrict,
  applied_count      smallint    not null check (applied_count >= 1),
  won_count          smallint    check (won_count >= 0),
  created_at         timestamptz not null default now(),
  updated_at         timestamptz not null default now(),
  constraint uq_round_applications unique (user_id, reception_round_id, event_slot_id, member_id),
  constraint chk_round_applications_won_count check (won_count is null or won_count <= applied_count)
);

create index idx_round_applications_user_id on round_applications (user_id);
create index idx_round_applications_reception_round_id on round_applications (reception_round_id);
create index idx_round_applications_user_round on round_applications (user_id, reception_round_id);

create trigger trg_round_applications_updated_at
  before update on round_applications
  for each row execute function set_updated_at();

-- -------------------------------------------------------------
-- round_application_rates (予想当選割合)
-- -------------------------------------------------------------
create table round_application_rates (
  user_id            uuid     not null references auth.users(id) on delete cascade,
  reception_round_id uuid     not null references reception_rounds(id) on delete restrict,
  member_id          uuid     not null references members(id) on delete restrict,
  expected_win_rate  smallint not null check (expected_win_rate >= 0 and expected_win_rate <= 100),
  created_at         timestamptz not null default now(),
  primary key (user_id, reception_round_id, member_id)
);

create index idx_round_application_rates_user_round on round_application_rates (user_id, reception_round_id);

-- -------------------------------------------------------------
-- attendance_records (参加記録)
-- -------------------------------------------------------------
create table attendance_records (
  id            uuid        primary key default gen_random_uuid(),
  user_id       uuid        not null references auth.users(id) on delete cascade,
  event_slot_id uuid        not null references event_slots(id) on delete restrict,
  member_id     uuid        not null references members(id) on delete restrict,
  status        text        not null check (status in ('attended', 'cancelled')),
  memo          text,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now(),
  constraint uq_attendance_records unique (user_id, event_slot_id, member_id)
);

create index idx_attendance_records_user_id on attendance_records (user_id);

create trigger trg_attendance_records_updated_at
  before update on attendance_records
  for each row execute function set_updated_at();

-- =============================================================
-- RLS ポリシー
-- =============================================================

-- マスターデータ: 全員 SELECT 可
alter table reception_rounds enable row level security;
alter table reception_round_targets enable row level security;

create policy "reception_rounds_select_all" on reception_rounds for select using (true);
create policy "reception_round_targets_select_all" on reception_round_targets for select using (true);

-- ユーザーデータ: 本人のみ CRUD
alter table user_oshi_members enable row level security;
alter table round_applications enable row level security;
alter table round_application_rates enable row level security;
alter table attendance_records enable row level security;

-- user_oshi_members
create policy "user_oshi_members_select_own" on user_oshi_members
  for select using (auth.uid() = user_id);
create policy "user_oshi_members_insert_own" on user_oshi_members
  for insert with check (auth.uid() = user_id);
create policy "user_oshi_members_update_own" on user_oshi_members
  for update using (auth.uid() = user_id);
create policy "user_oshi_members_delete_own" on user_oshi_members
  for delete using (auth.uid() = user_id);

-- round_applications
create policy "round_applications_select_own" on round_applications
  for select using (auth.uid() = user_id);
create policy "round_applications_insert_own" on round_applications
  for insert with check (auth.uid() = user_id);
create policy "round_applications_update_own" on round_applications
  for update using (auth.uid() = user_id);
create policy "round_applications_delete_own" on round_applications
  for delete using (auth.uid() = user_id);

-- round_application_rates
create policy "round_application_rates_select_own" on round_application_rates
  for select using (auth.uid() = user_id);
create policy "round_application_rates_insert_own" on round_application_rates
  for insert with check (auth.uid() = user_id);
create policy "round_application_rates_update_own" on round_application_rates
  for update using (auth.uid() = user_id);
create policy "round_application_rates_delete_own" on round_application_rates
  for delete using (auth.uid() = user_id);

-- attendance_records
create policy "attendance_records_select_own" on attendance_records
  for select using (auth.uid() = user_id);
create policy "attendance_records_insert_own" on attendance_records
  for insert with check (auth.uid() = user_id);
create policy "attendance_records_update_own" on attendance_records
  for update using (auth.uid() = user_id);
create policy "attendance_records_delete_own" on attendance_records
  for delete using (auth.uid() = user_id);

-- =============================================================
-- ビュー
-- =============================================================

-- v_participation_status: 参加ステータス集計
create view v_participation_status
  with (security_invoker = true)
as
select
  ra.user_id,
  rr.event_id,
  es.event_day_id,
  es.slot_number,
  ra.event_slot_id,
  ra.member_id,
  case
    when bool_or(ra.won_count > 0) then 'won'
    when bool_or(ra.won_count is null) then 'applied'
    else 'lost'
  end as status,
  sum(ra.applied_count)                                                    as total_applied,
  sum(coalesce(ra.won_count, 0))                                           as total_won,
  coalesce(sum(ra.applied_count) filter (where ra.won_count is null), 0)   as pending_count
from round_applications ra
join reception_rounds rr on rr.id = ra.reception_round_id
join event_slots es on es.id = ra.event_slot_id
group by ra.user_id, rr.event_id, es.event_day_id, es.slot_number, ra.event_slot_id, ra.member_id;

-- v_user_release_summary: リリース単位のサマリー
create view v_user_release_summary
  with (security_invoker = true)
as
select
  ra.user_id,
  e.release_id,
  sum(ra.applied_count)                                                                          as total_applied,
  sum(coalesce(ra.won_count, 0))                                                                 as total_won,
  sum(
    case
      when e.cd_type = 'regular' then coalesce(ra.won_count, 0) * e.unit_price
      when e.cd_type = 'limited' then ra.applied_count * e.unit_price
    end
  )                                                                                              as total_cost,
  sum(case when e.cd_type = 'limited' and ra.won_count is not null then ra.applied_count else 0 end) as used_serials,
  sum(case when e.cd_type = 'limited' and ra.won_count is null     then ra.applied_count else 0 end) as pending_serials
from round_applications ra
join reception_rounds rr on rr.id = ra.reception_round_id
join events e on e.id = rr.event_id
group by ra.user_id, e.release_id;
