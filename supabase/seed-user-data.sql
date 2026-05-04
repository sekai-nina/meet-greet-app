-- =============================================================
-- ローカル開発用: テストユーザーのサンプルデータ
-- make db-seed-user で実行される
-- auth.users の最初のユーザーにデータを紐づける
-- =============================================================
do $$
declare
  v_user_id       uuid;
  v_sakai_id      uuid;
  v_shogenji_id   uuid;
  v_kosaka_id     uuid;
  v_uemura_id     uuid;
  v_round1_id     uuid;
  v_round2_id     uuid;
  v_round3_id     uuid;
  v_ltd_round1_id uuid;
  v_slot_id       uuid;
begin
  -- 最初のユーザーを取得
  select id into v_user_id from auth.users order by created_at desc limit 1;
  if v_user_id is null then
    raise exception 'No auth user found. Please login to the app first.';
  end if;

  raise notice 'Seeding data for user: %', v_user_id;

  -- メンバー ID 取得
  select id into v_sakai_id    from members where name = '坂井新奈';
  select id into v_shogenji_id from members where name = '正源司陽子';
  select id into v_kosaka_id   from members where name = '小坂菜緒';
  select id into v_uemura_id   from members where name = '上村ひなの';

  -- ----- 推しメン (4名) -----
  insert into user_oshi_members (user_id, member_id, display_order) values
    (v_user_id, v_sakai_id,    1),
    (v_user_id, v_shogenji_id, 2),
    (v_user_id, v_kosaka_id,   3),
    (v_user_id, v_uemura_id,   4)
  on conflict do nothing;

  -- ----- 受付次 ID 取得 (通常盤) -----
  select rr.id into v_round1_id from reception_rounds rr join events e on e.id = rr.event_id where e.format = 'regular_online' and rr.round_number = 1 limit 1;
  select rr.id into v_round2_id from reception_rounds rr join events e on e.id = rr.event_id where e.format = 'regular_online' and rr.round_number = 2 limit 1;
  select rr.id into v_round3_id from reception_rounds rr join events e on e.id = rr.event_id where e.format = 'regular_online' and rr.round_number = 3 limit 1;

  -- ----- 受付次 ID 取得 (初回限定盤) -----
  select rr.id into v_ltd_round1_id from reception_rounds rr join events e on e.id = rr.event_id where e.format = 'limited_online' and rr.round_number = 1 limit 1;

  -- ===== 通常盤 1次: 坂井新奈 =====
  select es.id into v_slot_id from event_slots es join event_days ed on ed.id = es.event_day_id join events e on e.id = ed.event_id where e.format = 'regular_online' and ed.day_number = 1 and es.slot_number = 1 limit 1;
  insert into round_applications (user_id, reception_round_id, event_slot_id, member_id, applied_count, won_count) values (v_user_id, v_round1_id, v_slot_id, v_sakai_id, 2, 1) on conflict do nothing;

  select es.id into v_slot_id from event_slots es join event_days ed on ed.id = es.event_day_id join events e on e.id = ed.event_id where e.format = 'regular_online' and ed.day_number = 1 and es.slot_number = 2 limit 1;
  insert into round_applications (user_id, reception_round_id, event_slot_id, member_id, applied_count, won_count) values (v_user_id, v_round1_id, v_slot_id, v_sakai_id, 1, 1) on conflict do nothing;

  select es.id into v_slot_id from event_slots es join event_days ed on ed.id = es.event_day_id join events e on e.id = ed.event_id where e.format = 'regular_online' and ed.day_number = 1 and es.slot_number = 3 limit 1;
  insert into round_applications (user_id, reception_round_id, event_slot_id, member_id, applied_count, won_count) values (v_user_id, v_round1_id, v_slot_id, v_sakai_id, 1, 0) on conflict do nothing;

  select es.id into v_slot_id from event_slots es join event_days ed on ed.id = es.event_day_id join events e on e.id = ed.event_id where e.format = 'regular_online' and ed.day_number = 3 and es.slot_number = 1 limit 1;
  insert into round_applications (user_id, reception_round_id, event_slot_id, member_id, applied_count, won_count) values (v_user_id, v_round1_id, v_slot_id, v_sakai_id, 2, 1) on conflict do nothing;

  -- ===== 通常盤 1次: 正源司陽子 =====
  select es.id into v_slot_id from event_slots es join event_days ed on ed.id = es.event_day_id join events e on e.id = ed.event_id where e.format = 'regular_online' and ed.day_number = 2 and es.slot_number = 3 limit 1;
  insert into round_applications (user_id, reception_round_id, event_slot_id, member_id, applied_count, won_count) values (v_user_id, v_round1_id, v_slot_id, v_shogenji_id, 1, null) on conflict do nothing;

  select es.id into v_slot_id from event_slots es join event_days ed on ed.id = es.event_day_id join events e on e.id = ed.event_id where e.format = 'regular_online' and ed.day_number = 2 and es.slot_number = 4 limit 1;
  insert into round_applications (user_id, reception_round_id, event_slot_id, member_id, applied_count, won_count) values (v_user_id, v_round1_id, v_slot_id, v_shogenji_id, 2, null) on conflict do nothing;

  -- ===== 通常盤 2次: 坂井新奈 =====
  select es.id into v_slot_id from event_slots es join event_days ed on ed.id = es.event_day_id join events e on e.id = ed.event_id where e.format = 'regular_online' and ed.day_number = 1 and es.slot_number = 4 limit 1;
  insert into round_applications (user_id, reception_round_id, event_slot_id, member_id, applied_count, won_count) values (v_user_id, v_round2_id, v_slot_id, v_sakai_id, 1, 1) on conflict do nothing;

  select es.id into v_slot_id from event_slots es join event_days ed on ed.id = es.event_day_id join events e on e.id = ed.event_id where e.format = 'regular_online' and ed.day_number = 5 and es.slot_number = 2 limit 1;
  insert into round_applications (user_id, reception_round_id, event_slot_id, member_id, applied_count, won_count) values (v_user_id, v_round2_id, v_slot_id, v_sakai_id, 2, null) on conflict do nothing;

  -- ===== 通常盤 2次: 小坂菜緒 =====
  select es.id into v_slot_id from event_slots es join event_days ed on ed.id = es.event_day_id join events e on e.id = ed.event_id where e.format = 'regular_online' and ed.day_number = 4 and es.slot_number = 1 limit 1;
  insert into round_applications (user_id, reception_round_id, event_slot_id, member_id, applied_count, won_count) values (v_user_id, v_round2_id, v_slot_id, v_kosaka_id, 1, 1) on conflict do nothing;

  -- ===== 通常盤 3次: 上村ひなの =====
  select es.id into v_slot_id from event_slots es join event_days ed on ed.id = es.event_day_id join events e on e.id = ed.event_id where e.format = 'regular_online' and ed.day_number = 6 and es.slot_number = 5 limit 1;
  insert into round_applications (user_id, reception_round_id, event_slot_id, member_id, applied_count, won_count) values (v_user_id, v_round3_id, v_slot_id, v_uemura_id, 1, null) on conflict do nothing;

  select es.id into v_slot_id from event_slots es join event_days ed on ed.id = es.event_day_id join events e on e.id = ed.event_id where e.format = 'regular_online' and ed.day_number = 6 and es.slot_number = 6 limit 1;
  insert into round_applications (user_id, reception_round_id, event_slot_id, member_id, applied_count, won_count) values (v_user_id, v_round3_id, v_slot_id, v_uemura_id, 1, 1) on conflict do nothing;

  -- ===== 初回限定盤 1次: 坂井新奈 =====
  select es.id into v_slot_id from event_slots es join event_days ed on ed.id = es.event_day_id join events e on e.id = ed.event_id where e.format = 'limited_online' and ed.day_number = 1 and es.slot_number = 1 limit 1;
  insert into round_applications (user_id, reception_round_id, event_slot_id, member_id, applied_count, won_count) values (v_user_id, v_ltd_round1_id, v_slot_id, v_sakai_id, 3, 1) on conflict do nothing;

  select es.id into v_slot_id from event_slots es join event_days ed on ed.id = es.event_day_id join events e on e.id = ed.event_id where e.format = 'limited_online' and ed.day_number = 1 and es.slot_number = 2 limit 1;
  insert into round_applications (user_id, reception_round_id, event_slot_id, member_id, applied_count, won_count) values (v_user_id, v_ltd_round1_id, v_slot_id, v_sakai_id, 2, null) on conflict do nothing;

  -- ----- 予想当選割合 -----
  insert into round_application_rates (user_id, reception_round_id, member_id, expected_win_rate) values (v_user_id, v_round1_id, v_sakai_id, 60) on conflict do nothing;
  insert into round_application_rates (user_id, reception_round_id, member_id, expected_win_rate) values (v_user_id, v_round1_id, v_shogenji_id, 30) on conflict do nothing;
  insert into round_application_rates (user_id, reception_round_id, member_id, expected_win_rate) values (v_user_id, v_round2_id, v_sakai_id, 50) on conflict do nothing;
  insert into round_application_rates (user_id, reception_round_id, member_id, expected_win_rate) values (v_user_id, v_round2_id, v_kosaka_id, 20) on conflict do nothing;
  insert into round_application_rates (user_id, reception_round_id, member_id, expected_win_rate) values (v_user_id, v_round3_id, v_uemura_id, 40) on conflict do nothing;

  raise notice 'Done! Sample data seeded for user %', v_user_id;
end $$;
