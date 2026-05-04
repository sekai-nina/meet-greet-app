-- =============================================================
-- ローカル開発用: ダミーユーザー 2 名のサンプル申込データ
-- make db-seed-dummy で実行される
-- 人気状況 (v_slot_popularity) の判定テスト用
-- =============================================================

do $$
declare
  v_user_a      uuid;
  v_user_b      uuid;
  v_sakai_id    uuid;
  v_shogenji_id uuid;
  v_kosaka_id   uuid;
  v_round1_id   uuid;
  v_round2_id   uuid;
  v_slot_id     uuid;
begin
  select id into v_user_a from auth.users where email = 'dummy-a@example.com';
  select id into v_user_b from auth.users where email = 'dummy-b@example.com';

  if v_user_a is null or v_user_b is null then
    raise exception 'Dummy users not found. Run: make db-seed-dummy first to create them.';
  end if;

  select id into v_sakai_id    from members where name = '坂井新奈';
  select id into v_shogenji_id from members where name = '正源司陽子';
  select id into v_kosaka_id   from members where name = '小坂菜緒';

  select rr.id into v_round1_id from reception_rounds rr join events e on e.id = rr.event_id where e.format = 'regular_online' and rr.round_number = 1 limit 1;
  select rr.id into v_round2_id from reception_rounds rr join events e on e.id = rr.event_id where e.format = 'regular_online' and rr.round_number = 2 limit 1;

  -- ===== ダミーユーザー A =====
  -- 坂井新奈 DAY1 1部: 2枚→全落ち (完売判定に寄与)
  select es.id into v_slot_id from event_slots es join event_days ed on ed.id = es.event_day_id join events e on e.id = ed.event_id where e.format = 'regular_online' and ed.day_number = 1 and es.slot_number = 1 limit 1;
  insert into round_applications (user_id, reception_round_id, event_slot_id, member_id, applied_count, won_count) values (v_user_a, v_round1_id, v_slot_id, v_sakai_id, 2, 0) on conflict do nothing;

  -- 坂井新奈 DAY1 2部: 2枚→一部当選 (混雑判定に寄与)
  select es.id into v_slot_id from event_slots es join event_days ed on ed.id = es.event_day_id join events e on e.id = ed.event_id where e.format = 'regular_online' and ed.day_number = 1 and es.slot_number = 2 limit 1;
  insert into round_applications (user_id, reception_round_id, event_slot_id, member_id, applied_count, won_count) values (v_user_a, v_round1_id, v_slot_id, v_sakai_id, 2, 1) on conflict do nothing;

  -- 坂井新奈 DAY1 3部: 1枚→全当選 (余裕あり)
  select es.id into v_slot_id from event_slots es join event_days ed on ed.id = es.event_day_id join events e on e.id = ed.event_id where e.format = 'regular_online' and ed.day_number = 1 and es.slot_number = 3 limit 1;
  insert into round_applications (user_id, reception_round_id, event_slot_id, member_id, applied_count, won_count) values (v_user_a, v_round1_id, v_slot_id, v_sakai_id, 1, 1) on conflict do nothing;

  -- 正源司陽子 DAY2 3部: 2枚→全落ち
  select es.id into v_slot_id from event_slots es join event_days ed on ed.id = es.event_day_id join events e on e.id = ed.event_id where e.format = 'regular_online' and ed.day_number = 2 and es.slot_number = 3 limit 1;
  insert into round_applications (user_id, reception_round_id, event_slot_id, member_id, applied_count, won_count) values (v_user_a, v_round1_id, v_slot_id, v_shogenji_id, 2, 0) on conflict do nothing;

  -- 小坂菜緒 DAY4 1部: 2枚→一部当選
  select es.id into v_slot_id from event_slots es join event_days ed on ed.id = es.event_day_id join events e on e.id = ed.event_id where e.format = 'regular_online' and ed.day_number = 4 and es.slot_number = 1 limit 1;
  insert into round_applications (user_id, reception_round_id, event_slot_id, member_id, applied_count, won_count) values (v_user_a, v_round2_id, v_slot_id, v_kosaka_id, 2, 1) on conflict do nothing;

  -- ===== ダミーユーザー B =====
  -- 坂井新奈 DAY1 1部: 1枚→全落ち (2人目→完売確定)
  select es.id into v_slot_id from event_slots es join event_days ed on ed.id = es.event_day_id join events e on e.id = ed.event_id where e.format = 'regular_online' and ed.day_number = 1 and es.slot_number = 1 limit 1;
  insert into round_applications (user_id, reception_round_id, event_slot_id, member_id, applied_count, won_count) values (v_user_b, v_round1_id, v_slot_id, v_sakai_id, 1, 0) on conflict do nothing;

  -- 坂井新奈 DAY1 2部: 2枚→一部当選 (2人目→混雑確定)
  select es.id into v_slot_id from event_slots es join event_days ed on ed.id = es.event_day_id join events e on e.id = ed.event_id where e.format = 'regular_online' and ed.day_number = 1 and es.slot_number = 2 limit 1;
  insert into round_applications (user_id, reception_round_id, event_slot_id, member_id, applied_count, won_count) values (v_user_b, v_round1_id, v_slot_id, v_sakai_id, 2, 1) on conflict do nothing;

  -- 坂井新奈 DAY1 4部: 1枚→全落ち (やや混雑: lost_reporters=1)
  select es.id into v_slot_id from event_slots es join event_days ed on ed.id = es.event_day_id join events e on e.id = ed.event_id where e.format = 'regular_online' and ed.day_number = 1 and es.slot_number = 4 limit 1;
  insert into round_applications (user_id, reception_round_id, event_slot_id, member_id, applied_count, won_count) values (v_user_b, v_round1_id, v_slot_id, v_sakai_id, 1, 0) on conflict do nothing;

  -- 正源司陽子 DAY2 3部: 1枚→全落ち (2人目→完売)
  select es.id into v_slot_id from event_slots es join event_days ed on ed.id = es.event_day_id join events e on e.id = ed.event_id where e.format = 'regular_online' and ed.day_number = 2 and es.slot_number = 3 limit 1;
  insert into round_applications (user_id, reception_round_id, event_slot_id, member_id, applied_count, won_count) values (v_user_b, v_round1_id, v_slot_id, v_shogenji_id, 1, 0) on conflict do nothing;

  -- 正源司陽子 DAY2 4部: 1枚→全当選 (余裕あり)
  select es.id into v_slot_id from event_slots es join event_days ed on ed.id = es.event_day_id join events e on e.id = ed.event_id where e.format = 'regular_online' and ed.day_number = 2 and es.slot_number = 4 limit 1;
  insert into round_applications (user_id, reception_round_id, event_slot_id, member_id, applied_count, won_count) values (v_user_b, v_round1_id, v_slot_id, v_shogenji_id, 1, 1) on conflict do nothing;

  raise notice 'Done! Dummy user data seeded.';
end $$;
