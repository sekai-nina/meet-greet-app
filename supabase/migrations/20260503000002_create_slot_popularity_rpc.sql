-- =============================================================
-- get_slot_popularity: 全ユーザーの申込データを匿名集計して
-- メンバー×スロットごとの人気度レベルを返す RPC 関数
--
-- SECURITY DEFINER: RLS をバイパスして全ユーザーのデータを集計
-- user_id や生の集計数値は返さない (プライバシー保護)
-- =============================================================

create or replace function get_slot_popularity(p_event_id uuid, p_member_id uuid)
returns table (
  event_slot_id    uuid,
  event_day_id     uuid,
  slot_number      smallint,
  popularity_level text
)
language sql
security definer
stable
set search_path = public
as $$
  select
    sub.event_slot_id,
    sub.event_day_id,
    sub.slot_number,
    case
      when sub.reporter_count < 3 then 'no_data'
      when sub.lost_reporters >= 2 then 'sold_out'
      when sub.partial_win_reporters >= 2
        or (sub.lost_reporters = 1 and sub.reporter_count >= 3) then 'busy'
      when sub.partial_win_reporters >= 1
        or sub.lost_reporters >= 1 then 'slightly_busy'
      else 'available'
    end as popularity_level
  from (
    select
      es.id as event_slot_id,
      es.event_day_id,
      es.slot_number::smallint,
      count(distinct ra.user_id) as reporter_count,
      count(distinct ra.user_id) filter (
        where ra.won_count = 0
      ) as lost_reporters,
      count(distinct ra.user_id) filter (
        where ra.won_count > 0 and ra.won_count < ra.applied_count
      ) as partial_win_reporters
    from public.event_slots es
    join public.event_days ed on ed.id = es.event_day_id
    left join public.round_applications ra on ra.event_slot_id = es.id and ra.member_id = p_member_id
    where ed.event_id = p_event_id
    group by es.id, es.event_day_id, es.slot_number
  ) sub
  order by sub.event_day_id, sub.slot_number;
$$;

-- 認証済みユーザーのみ呼び出し可能
revoke execute on function get_slot_popularity(uuid, uuid) from public;
grant execute on function get_slot_popularity(uuid, uuid) to authenticated;
