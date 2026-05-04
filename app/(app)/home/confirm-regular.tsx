import { useState } from 'react';
import { Alert, Linking, Modal, ScrollView, Text, TouchableOpacity, View } from 'react-native';

import { useRouter } from 'expo-router';

import { useQueryClient } from '@tanstack/react-query';

import { Button } from '@/components/Button';
import { useAllReceptions } from '@/hooks/use-all-receptions';
import { useAuth } from '@/hooks/use-auth';
import { useLatestRelease } from '@/hooks/use-latest-release';
import { useReleaseEvents } from '@/hooks/use-release-events';
import { useReleaseSummary } from '@/hooks/use-release-summary';
import { supabase } from '@/lib/supabase';
import { useApplyFormStore } from '@/stores/apply-form-store';

const DEFAULT_WIN_RATE = 50;

export default function ConfirmRegularScreen() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data: release } = useLatestRelease();
  const { data: summary } = useReleaseSummary(release?.id);
  const { data: releaseEvents } = useReleaseEvents(release?.id);
  const { data: allReceptions } = useAllReceptions(release?.id);
  const { user } = useAuth();
  const store = useApplyFormStore();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const applications = store.getRegularApplicationsList();

  // 通常盤オンラインイベントの単価を取得
  const regularEvent = releaseEvents?.find(
    (e) => e.format === 'regular_online',
  );
  const regularUnitPrice = regularEvent?.unit_price ?? 1200;

  const paidAmount = (summary?.total_won ?? 0) * regularUnitPrice;

  // fortune_url
  const fortuneUrl = regularEvent?.fortune_url ?? null;

  // 選択された受付次番号から実際の DB の reception_round_id を取得
  const actualRoundId = (() => {
    const regularRounds = (allReceptions ?? []).filter(
      (r) => r.events.format === 'regular_online',
    );
    const match = regularRounds.find(
      (r) => r.round_number === store.roundNumber,
    );
    return match?.id ?? null;
  })();

  const handleSubmit = async () => {
    if (isSubmitting) return;
    if (!user) {
      Alert.alert('エラー', 'ログインが必要です');
      return;
    }
    if (!actualRoundId) {
      Alert.alert('エラー', `第${store.roundNumber}次の受付データが見つかりません`);
      return;
    }
    setIsSubmitting(true);

    // ⚠️ CRITICAL TODO (v2): Supabase RPC に移行し、全テーブルへの書き込みを 1 トランザクションにまとめる。
    // 途中失敗で round_applications が DELETE されたまま復元されないリスクあり。
    try {
      const items = applications.flatMap((app) =>
        app.slots.map((slot) => ({
          event_slot_id: slot.eventSlotId,
          member_id: app.memberId,
          applied_count: slot.count,
        })),
      );

      if (items.length === 0) {
        Alert.alert('エラー', '申込みデータがありません');
        return;
      }

      // 1. 登録スナップショットを作成
      const { data: registration, error: regError } = await supabase
        .from('registrations')
        .insert({ user_id: user.id, reception_round_id: actualRoundId })
        .select('id')
        .single();
      if (regError) throw regError;

      // 2. 登録内容を保存 (スナップショット)
      const { error: itemsError } = await supabase
        .from('registration_items')
        .insert(
          items.map((item) => ({
            registration_id: registration.id,
            ...item,
          })),
        );
      if (itemsError) throw itemsError;

      // 3. 予想当選割合を保存 (登録ごと)
      const rateRows = applications
        .map((app) => ({
          registration_id: registration.id,
          member_id: app.memberId,
          expected_win_rate:
            store.expectedWinRates.get(app.memberId) ?? DEFAULT_WIN_RATE,
        }));

      if (rateRows.length > 0) {
        const { error: rateError } = await supabase
          .from('registration_rates')
          .insert(rateRows);
        if (rateError) throw rateError;
      }

      // 4. 既存の round_applications を削除 (ユーザーが削除したスロットを反映)
      const { error: deleteError } = await supabase
        .from('round_applications')
        .delete()
        .eq('user_id', user.id)
        .eq('reception_round_id', actualRoundId);
      if (deleteError) throw deleteError;

      // 5. 集約テーブルを UPSERT (最新状態)
      const { error: upsertError } = await supabase
        .from('round_applications')
        .upsert(
          items.map((item) => ({
            user_id: user.id,
            reception_round_id: actualRoundId,
            ...item,
          })),
          { onConflict: 'user_id,reception_round_id,event_slot_id,member_id' },
        );
      if (upsertError) throw upsertError;

      // 6. 既存の round_application_rates を削除 (再登録時に古いメンバー分を除去)
      const { error: deleteRateError } = await supabase
        .from('round_application_rates')
        .delete()
        .eq('user_id', user.id)
        .eq('reception_round_id', actualRoundId);
      if (deleteRateError) throw deleteRateError;

      // 7. round_application_rates も最新値で UPSERT
      const aggRateRows = applications.map((app) => ({
        user_id: user.id,
        reception_round_id: actualRoundId,
        member_id: app.memberId,
        expected_win_rate:
          store.expectedWinRates.get(app.memberId) ?? DEFAULT_WIN_RATE,
      }));
      if (aggRateRows.length > 0) {
        const { error: aggRateError } = await supabase
          .from('round_application_rates')
          .upsert(aggRateRows, {
            onConflict: 'user_id,reception_round_id,member_id',
          });
        if (aggRateError) throw aggRateError;
      }

      // キャッシュを無効化してホーム画面のデータをリフレッシュ
      void queryClient.invalidateQueries({ queryKey: ['release-summary', release?.id] });
      void queryClient.invalidateQueries({ queryKey: ['won-tickets', release?.id] });
      void queryClient.invalidateQueries({ queryKey: ['participation-heatmap', release?.id] });
      void queryClient.invalidateQueries({ queryKey: ['payment-estimate', release?.id] });
      void queryClient.invalidateQueries({ queryKey: ['applied-members', release?.id] });

      setShowSuccessModal(true);
    } catch {
      Alert.alert('エラー', '登録に失敗しました。しばらくしてからもう一度お試しください。');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCloseSuccess = () => {
    setShowSuccessModal(false);
    store.reset();
    router.navigate('/(app)/(tabs)');
  };

  const handleOpenFortuneUrl = () => {
    if (fortuneUrl) {
      void Linking.openURL(fortuneUrl);
    }
  };

  return (
    <View className="flex-1 bg-bg">
      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 100 }}>
        {/* 支払い済み */}
        <View className="rounded-xl border border-border bg-white p-4 mb-4">
          <Text className="text-sm font-semibold text-text mb-2">
            支払い済み
          </Text>
          <View className="flex-row justify-between">
            <Text className="text-sm text-text-muted">当選済みの枠</Text>
            <Text className="text-sm text-text">
              {summary?.total_won ?? 0}枚 × ¥{regularUnitPrice.toLocaleString()} →{' '}
              ¥{paidAmount.toLocaleString()}
            </Text>
          </View>
        </View>

        {/* 今回の申込み */}
        <Text className="text-sm font-semibold text-text mb-2 ml-1">
          今回の申込み
        </Text>
        {applications.map((app) => {
          const totalSlots = app.slots.reduce((sum, s) => sum + s.count, 0);
          const winRate =
            store.expectedWinRates.get(app.memberId) ?? DEFAULT_WIN_RATE;
          const estimatedCost = totalSlots * regularUnitPrice * winRate / 100;

          return (
            <View
              key={app.memberId}
              className="rounded-xl border border-border bg-white p-4 mb-3"
            >
              <View className="flex-row items-center justify-between mb-3">
                <Text className="text-base font-bold text-text">
                  {app.memberName}
                </Text>
                <Text className="text-sm text-text-muted">
                  {totalSlots}枚
                </Text>
              </View>

              {app.slots.map((slot) => (
                <View
                  key={slot.eventSlotId}
                  className="flex-row items-center py-1.5 border-b border-divider"
                >
                  <View className="bg-primary-soft rounded-full px-2 py-0.5 mr-2">
                    <Text className="text-xs font-medium text-text">
                      DAY{slot.dayNumber}
                    </Text>
                  </View>
                  <Text className="text-sm text-text-muted flex-1">
                    {slot.slotNumber}部
                  </Text>
                  <Text className="text-sm text-text">
                    {slot.count}枚
                  </Text>
                </View>
              ))}

              {/* 予想当選割合 */}
              <View className="flex-row items-center justify-between mt-3 pt-3 border-t border-divider">
                <Text className="text-sm text-text-muted">予想当選割合</Text>
                <View className="flex-row items-center">
                  <TouchableOpacity
                    className="w-7 h-7 rounded-full bg-gray-100 items-center justify-center"
                    onPress={() =>
                      store.setExpectedWinRate(
                        app.memberId,
                        Math.max(0, winRate - 10),
                      )
                    }
                  >
                    <Text className="text-sm text-text-muted">−</Text>
                  </TouchableOpacity>
                  <Text className="text-base font-bold text-text mx-3">
                    {winRate}%
                  </Text>
                  <TouchableOpacity
                    className="w-7 h-7 rounded-full bg-gray-100 items-center justify-center"
                    onPress={() =>
                      store.setExpectedWinRate(
                        app.memberId,
                        Math.min(100, winRate + 10),
                      )
                    }
                  >
                    <Text className="text-sm text-text-muted">+</Text>
                  </TouchableOpacity>
                </View>
              </View>

              <Text className="text-xs text-text-muted text-right mt-1">
                見込み費用: ¥{Math.round(estimatedCost).toLocaleString()}
              </Text>
            </View>
          );
        })}

        {applications.length === 0 && (
          <View className="rounded-xl border border-border bg-white p-4 mb-3">
            <Text className="text-sm text-text-muted text-center">
              申込みデータがありません
            </Text>
          </View>
        )}

        {/* サマリーカード */}
        {applications.length > 0 && (
          <View className="rounded-xl bg-surface p-4 mb-4">
            <View className="flex-row justify-between py-1">
              <Text className="text-sm text-text-muted">支払い済み</Text>
              <Text className="text-sm text-text">
                ¥{paidAmount.toLocaleString()}
              </Text>
            </View>
            <View className="flex-row justify-between py-1">
              <Text className="text-sm text-text-muted">見込み費用</Text>
              <Text className="text-sm text-text">
                ¥{applications
                  .reduce((sum, app) => {
                    const total = app.slots.reduce(
                      (s, slot) => s + slot.count,
                      0,
                    );
                    const rate =
                      store.expectedWinRates.get(app.memberId) ??
                      DEFAULT_WIN_RATE;
                    return sum + Math.round(total * regularUnitPrice * rate / 100);
                  }, 0)
                  .toLocaleString()}
              </Text>
            </View>
            <View className="flex-row justify-between py-1 border-t border-primary mt-1 pt-2">
              <Text className="text-base font-bold text-text">
                合計見込み
              </Text>
              <Text className="text-base font-bold text-text">
                ¥{(
                  paidAmount +
                  applications.reduce((sum, app) => {
                    const total = app.slots.reduce(
                      (s, slot) => s + slot.count,
                      0,
                    );
                    const rate =
                      store.expectedWinRates.get(app.memberId) ??
                      DEFAULT_WIN_RATE;
                    return sum + Math.round(total * regularUnitPrice * rate / 100);
                  }, 0)
                ).toLocaleString()}
              </Text>
            </View>
          </View>
        )}

        <Button
          label="登録する"
          isDisabled={applications.length === 0}
          isLoading={isSubmitting}
          onPress={handleSubmit}
        />
      </ScrollView>

      {/* 登録完了モーダル */}
      <Modal visible={showSuccessModal} animationType="fade" transparent>
        <View className="flex-1 items-center justify-center bg-black/40 px-8">
          <View className="bg-white rounded-xl px-8 py-10 w-full max-w-[340px] items-center shadow-2xl">
            <View className="w-16 h-16 rounded-full bg-green-100 items-center justify-center mb-5">
              <Text className="text-2xl text-green-600">✓</Text>
            </View>
            <Text className="text-xl font-bold text-text text-center mb-6">
              登録しました
            </Text>
            <View className="rounded-lg bg-amber-50 border border-amber-200 px-4 py-3 mb-6 w-full">
              <Text className="text-xs text-amber-800 leading-5">
                ⚠ この登録だけでは申込みは完了しません。{'\n'}
                必ず申込みサイトから手続きを行ってください。
              </Text>
            </View>
            {fortuneUrl && (
              <View className="w-full mb-3">
                <Button
                  label="申込みサイトを開く"
                  onPress={handleOpenFortuneUrl}
                />
              </View>
            )}
            <TouchableOpacity
              className="py-3 w-full"
              onPress={handleCloseSuccess}
            >
              <Text className="text-sm text-text-muted text-center">
                閉じる
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}
