-- NOTE: この migration は db-reset (全テーブル再作成) を前提としています。
-- 本番環境で適用する場合は、既存データのバックフィル (format: 'online' → 'regular_online' 等) が必要です。

-- =============================================================
-- events テーブルの format 変更と列追加
-- event_days に venue を追加
-- =============================================================

-- -------------------------------------------------------------
-- events.format: 'online'|'offline' → 'regular_online'|'limited_online'|'real'
-- -------------------------------------------------------------
alter table events drop constraint events_format_check;
alter table events add constraint events_format_check
  check (format in ('regular_online', 'limited_online', 'real'));

-- -------------------------------------------------------------
-- events: 新カラム追加
-- -------------------------------------------------------------
alter table events add column cd_type    text not null default 'regular'
  check (cd_type in ('regular', 'limited'));
alter table events add column unit_price int  not null default 0
  check (unit_price >= 0);
alter table events add column fortune_url text;

-- デフォルト値を除去 (既存行のバックフィル用に一時設定)
alter table events alter column cd_type    drop default;
alter table events alter column unit_price drop default;

-- -------------------------------------------------------------
-- event_days: venue (nullable, リアルミーグリ用)
-- -------------------------------------------------------------
alter table event_days add column venue text;
