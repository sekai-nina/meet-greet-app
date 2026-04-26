-- =============================================================
-- M1 #13: マスタ系テーブル (releases, members, release_centers)
-- =============================================================

-- updated_at 自動更新トリガー関数
create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- -------------------------------------------------------------
-- releases (リリース: シングル or アルバム)
-- -------------------------------------------------------------
create table releases (
  id           uuid        primary key default gen_random_uuid(),
  title        text        not null,
  number       int         not null,
  release_date date,
  release_type text        not null check (release_type in ('single', 'album')),
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

create trigger trg_releases_updated_at
  before update on releases
  for each row execute function set_updated_at();

-- -------------------------------------------------------------
-- members (日向坂46 メンバー)
-- -------------------------------------------------------------
create table members (
  id         uuid        primary key default gen_random_uuid(),
  name       text        not null,
  generation int         not null,
  birthday   date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger trg_members_updated_at
  before update on members
  for each row execute function set_updated_at();

-- -------------------------------------------------------------
-- release_centers (リリースのセンター、ダブルセンター対応)
-- -------------------------------------------------------------
create table release_centers (
  release_id   uuid not null references releases(id) on delete restrict,
  member_id    uuid not null references members(id) on delete restrict,
  center_order int  not null check (center_order > 0),
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now(),
  primary key (release_id, member_id),
  unique (release_id, center_order)
);

create trigger trg_release_centers_updated_at
  before update on release_centers
  for each row execute function set_updated_at();
