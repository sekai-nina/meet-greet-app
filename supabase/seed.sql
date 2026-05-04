-- =============================================================
-- M1 #15: seed データ
-- 17th シングル + メンバー 27 名 + 6 日程 × 6 部
-- =============================================================

-- -------------------------------------------------------------
-- メンバー 27 名 (2期生〜5期生)
-- -------------------------------------------------------------
insert into members (name, generation, birthday) values
  -- 2期生 (2名)
  ('金村美玖',     2, '2002-09-10'),
  ('小坂菜緒',     2, '2002-09-07'),
  -- 3期生 (4名)
  ('上村ひなの',   3, '2004-04-12'),
  ('髙橋未来虹',   3, '2003-09-27'),
  ('森本茉莉',     3, '2004-02-23'),
  ('山口陽世',     3, '2004-02-23'),
  -- 4期生 (11名)
  ('石塚瑶季',     4, '2004-08-06'),
  ('小西夏菜実',   4, '2004-10-03'),
  ('清水理央',     4, '2005-01-15'),
  ('正源司陽子',   4, '2007-02-14'),
  ('竹内希来里',   4, '2006-02-20'),
  ('平尾帆夏',     4, '2003-07-31'),
  ('平岡海月',     4, '2002-04-09'),
  ('藤嶌果歩',     4, '2006-08-07'),
  ('宮地すみれ',   4, '2005-12-31'),
  ('山下葉留花',   4, '2003-05-20'),
  ('渡辺莉奈',     4, '2009-02-07'),
  -- 5期生 (10名)
  ('大田美月',     5, '2006-12-07'),
  ('大野愛実',     5, '2007-05-05'),
  ('片山紗希',     5, '2006-12-26'),
  ('蔵盛妃那乃',   5, '2006-01-23'),
  ('坂井新奈',     5, '2009-03-14'),
  ('佐藤優羽',     5, '2006-09-10'),
  ('下田衣珠季',   5, '2006-12-26'),
  ('高井俐香',     5, '2007-08-01'),
  ('鶴崎仁香',     5, '2004-03-27'),
  ('松尾桜',       5, '2005-06-08');

-- -------------------------------------------------------------
-- リリース: 17th シングル
-- -------------------------------------------------------------
insert into releases (title, number, release_date, release_type)
values ('Kind of love', 17, '2026-05-27', 'single');

-- -------------------------------------------------------------
-- センター: 正源司陽子
-- -------------------------------------------------------------
insert into release_centers (release_id, member_id, center_order)
select r.id, m.id, 1
from releases r, members m
where r.number = 17 and r.release_type = 'single'
  and m.name = '正源司陽子';

-- -------------------------------------------------------------
-- イベント: 17th 通常盤オンラインミーグリ
-- -------------------------------------------------------------
insert into events (release_id, format, cd_type, unit_price, fortune_url)
select id, 'regular_online', 'regular', 1200, 'https://fortunemusic.jp/'
from releases
where number = 17 and release_type = 'single';

-- イベント: 17th 初回限定盤オンラインミーグリ
insert into events (release_id, format, cd_type, unit_price, fortune_url)
select id, 'limited_online', 'limited', 2000, 'https://fortunemusic.jp/'
from releases
where number = 17 and release_type = 'single';

-- イベント: 17th リアルミーグリ
insert into events (release_id, format, cd_type, unit_price)
select id, 'real', 'limited', 2000
from releases
where number = 17 and release_type = 'single';

-- -------------------------------------------------------------
-- 開催日: 通常盤オンライン 6 日程
-- -------------------------------------------------------------
insert into event_days (event_id, day_number, date)
select e.id, v.day_number, v.date::date
from events e
join releases r on r.id = e.release_id
cross join (values
  (1, '2026-05-31'),
  (2, '2026-06-07'),
  (3, '2026-07-05'),
  (4, '2026-07-19'),
  (5, '2026-08-08'),
  (6, '2026-08-09')
) as v(day_number, date)
where r.number = 17 and r.release_type = 'single'
  and e.format = 'regular_online';

-- 開催日: 初回限定盤オンライン 1 日程
insert into event_days (event_id, day_number, date)
select e.id, 1, '2026-08-23'::date
from events e
join releases r on r.id = e.release_id
where r.number = 17 and r.release_type = 'single'
  and e.format = 'limited_online';

-- 開催日: リアルミーグリ 2 日程
insert into event_days (event_id, day_number, date, venue)
select e.id, v.day_number, v.date::date, v.venue
from events e
join releases r on r.id = e.release_id
cross join (values
  (1, '2026-07-26', '東京ビッグサイト'),
  (2, '2026-08-16', '梅田クリスタルホール')
) as v(day_number, date, venue)
where r.number = 17 and r.release_type = 'single'
  and e.format = 'real';

-- -------------------------------------------------------------
-- 部: 通常盤オンライン 各日 6 部 (JST → UTC 変換済み)
-- 第1部 11:00-12:00 JST = 02:00-03:00 UTC
-- 第2部 12:30-13:30 JST = 03:30-04:30 UTC
-- 第3部 14:00-15:00 JST = 05:00-06:00 UTC
-- 第4部 16:00-17:00 JST = 07:00-08:00 UTC
-- 第5部 17:30-18:30 JST = 08:30-09:30 UTC
-- 第6部 19:00-20:00 JST = 10:00-11:00 UTC
-- -------------------------------------------------------------
insert into event_slots (event_day_id, slot_number, starts_at, ends_at)
select
  ed.id,
  s.slot_number,
  (ed.date || ' ' || s.start_time)::timestamptz,
  (ed.date || ' ' || s.end_time)::timestamptz
from event_days ed
join events e on e.id = ed.event_id
join releases r on r.id = e.release_id
cross join (values
  (1, '02:00:00+00', '03:00:00+00'),
  (2, '03:30:00+00', '04:30:00+00'),
  (3, '05:00:00+00', '06:00:00+00'),
  (4, '07:00:00+00', '08:00:00+00'),
  (5, '08:30:00+00', '09:30:00+00'),
  (6, '10:00:00+00', '11:00:00+00')
) as s(slot_number, start_time, end_time)
where r.number = 17 and r.release_type = 'single'
  and e.format = 'regular_online';

-- 部: 初回限定盤オンライン 各日 4 部
insert into event_slots (event_day_id, slot_number, starts_at, ends_at)
select
  ed.id,
  s.slot_number,
  (ed.date || ' ' || s.start_time)::timestamptz,
  (ed.date || ' ' || s.end_time)::timestamptz
from event_days ed
join events e on e.id = ed.event_id
join releases r on r.id = e.release_id
cross join (values
  (1, '02:00:00+00', '03:00:00+00'),
  (2, '03:30:00+00', '04:30:00+00'),
  (3, '05:00:00+00', '06:00:00+00'),
  (4, '07:00:00+00', '08:00:00+00')
) as s(slot_number, start_time, end_time)
where r.number = 17 and r.release_type = 'single'
  and e.format = 'limited_online';

-- 部: リアルミーグリ 各日 4 部
insert into event_slots (event_day_id, slot_number, starts_at, ends_at)
select
  ed.id,
  s.slot_number,
  (ed.date || ' ' || s.start_time)::timestamptz,
  (ed.date || ' ' || s.end_time)::timestamptz
from event_days ed
join events e on e.id = ed.event_id
join releases r on r.id = e.release_id
cross join (values
  (1, '02:00:00+00', '03:00:00+00'),
  (2, '03:30:00+00', '04:30:00+00'),
  (3, '05:00:00+00', '06:00:00+00'),
  (4, '07:00:00+00', '08:00:00+00')
) as s(slot_number, start_time, end_time)
where r.number = 17 and r.release_type = 'single'
  and e.format = 'real';

-- -------------------------------------------------------------
-- 出演メンバー: 全メンバー × 全日程 (全イベント形式)
-- -------------------------------------------------------------
insert into event_day_members (event_day_id, member_id)
select ed.id, m.id
from event_days ed
join events e on e.id = ed.event_id
join releases r on r.id = e.release_id
cross join members m
where r.number = 17 and r.release_type = 'single';

-- -------------------------------------------------------------
-- 受付次: 通常盤オンライン 6 次 + 初回限定盤 6 次 + リアル 6 次
-- -------------------------------------------------------------

-- 通常盤オンライン: 6 次
insert into reception_rounds (event_id, round_number, start_at, end_at, max_applications)
select e.id, v.round_number, v.start_at::timestamptz, v.end_at::timestamptz, v.max_apps
from events e
join releases r on r.id = e.release_id
cross join (values
  (1, '2026-04-02 03:00:00+00', '2026-04-03 03:00:00+00', 2),
  (2, '2026-04-09 03:00:00+00', '2026-04-10 03:00:00+00', 3),
  (3, '2026-04-16 03:00:00+00', '2026-04-17 03:00:00+00', 4),
  (4, '2026-04-30 05:00:00+00', '2026-05-01 05:00:00+00', 5),
  (5, '2026-05-14 03:00:00+00', '2026-05-15 03:00:00+00', 5),
  (6, '2026-05-28 03:00:00+00', '2026-05-29 03:00:00+00', 5)
) as v(round_number, start_at, end_at, max_apps)
where r.number = 17 and r.release_type = 'single'
  and e.format = 'regular_online';

-- 初回限定盤 (limited_online + real 共通): 6 次
-- limited_online
insert into reception_rounds (event_id, round_number, start_at, end_at, max_applications)
select e.id, v.round_number, v.start_at::timestamptz, v.end_at::timestamptz, v.max_apps
from events e
join releases r on r.id = e.release_id
cross join (values
  (1, '2026-05-07 03:00:00+00', '2026-05-08 03:00:00+00', 3),
  (2, '2026-05-14 03:00:00+00', '2026-05-15 03:00:00+00', 3),
  (3, '2026-05-21 03:00:00+00', '2026-05-22 03:00:00+00', 3),
  (4, '2026-05-28 03:00:00+00', '2026-05-29 03:00:00+00', 3),
  (5, '2026-06-04 03:00:00+00', '2026-06-05 03:00:00+00', 3),
  (6, '2026-06-11 03:00:00+00', '2026-06-12 03:00:00+00', 3)
) as v(round_number, start_at, end_at, max_apps)
where r.number = 17 and r.release_type = 'single'
  and e.format = 'limited_online';

-- real
insert into reception_rounds (event_id, round_number, start_at, end_at, max_applications)
select e.id, v.round_number, v.start_at::timestamptz, v.end_at::timestamptz, v.max_apps
from events e
join releases r on r.id = e.release_id
cross join (values
  (1, '2026-05-07 03:00:00+00', '2026-05-08 03:00:00+00', 3),
  (2, '2026-05-14 03:00:00+00', '2026-05-15 03:00:00+00', 3),
  (3, '2026-05-21 03:00:00+00', '2026-05-22 03:00:00+00', 3),
  (4, '2026-05-28 03:00:00+00', '2026-05-29 03:00:00+00', 3),
  (5, '2026-06-04 03:00:00+00', '2026-06-05 03:00:00+00', 3),
  (6, '2026-06-11 03:00:00+00', '2026-06-12 03:00:00+00', 3)
) as v(round_number, start_at, end_at, max_apps)
where r.number = 17 and r.release_type = 'single'
  and e.format = 'real';

-- -------------------------------------------------------------
-- 受付次の対象日程: 全受付次 → 全日程
-- -------------------------------------------------------------
insert into reception_round_targets (reception_round_id, event_day_id, is_final_round)
select rr.id, ed.id,
  -- 最終受付次: 各イベントの max(round_number) = 6次
  case
    when rr.round_number = (
      select max(rr2.round_number)
      from reception_rounds rr2
      where rr2.event_id = rr.event_id
    ) then true
    else false
  end
from reception_rounds rr
join events e on e.id = rr.event_id
join event_days ed on ed.event_id = e.id;

-- サンプルユーザーデータは make db-seed-user で投入する
-- (Auth Admin API でユーザー作成 → supabase/seed-user-data.sql を実行)
