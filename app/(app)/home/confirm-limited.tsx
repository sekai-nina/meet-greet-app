import { useState } from 'react';
import { Alert, Linking, Modal, ScrollView, Text, TouchableOpacity, View } from 'react-native';

import { useRouter } from 'expo-router';

import { useQueryClient } from '@tanstack/react-query';

import { Button } from '@/components/Button';
import { useAllReceptions } from '@/hooks/use-all-receptions';
import { useAuth } from '@/hooks/use-auth';
import { useLatestRelease } from '@/hooks/use-latest-release';
import { useReleaseEvents } from '@/hooks/use-release-events';
import { supabase } from '@/lib/supabase';
import { useApplyFormStore } from '@/stores/apply-form-store';

export default function ConfirmLimitedScreen() {
  const router = useRouter();
  const { data: release } = useLatestRelease();
  const { data: releaseEvents } = useReleaseEvents(release?.id);
  const { data: allReceptions } = useAllReceptions(release?.id);
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const store = useApplyFormStore();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const onlineSlots = store.limitedOnlineSlots;
  const realSlots = store.limitedRealSlots;
  const memberId = store.limitedMemberId;

  const onlineCount = onlineSlots.reduce((sum, s) => sum + s.count, 0);
  const realCount = realSlots.reduce((sum, s) => sum + s.count, 0);
  const totalNewSerials = onlineCount + realCount;

  // 既存の使用済みシリアル (ダミー: 0)
  const usedSerials = 0;
  const totalSerials = usedSerials + totalNewSerials;

  // fortune_url
  const limitedEvent = releaseEvents?.find(
    (e) => e.format === 'limited_online',
  );
  const fortuneUrl = limitedEvent?.fortune_url ?? null;

  // 選択された受付次番号から実際の DB の reception_round_id をフォーマット別に取得
  const onlineRoundId = (() => {
    const rounds = (allReceptions ?? []).filter(
      (r) => r.events.format === 'limited_online',
    );
    return rounds.find((r) => r.round_number === store.roundNumber)?.id ?? null;
  })();

  const realRoundId = (() => {
    const rounds = (allReceptions ?? []).filter(
      (r) => r.events.format === 'real',
    );
    return rounds.find((r) => r.round_number === store.roundNumber)?.id ?? null;
  })();

  const handleSubmit = async () => {
    if (isSubmitting) return;
    if (!user) {
      Alert.alert('エラー', 'ログインが必要です');
      return;
    }
    if (!memberId) {
      Alert.alert('エラー', 'メンバーが選択されていません');
      return;
    }

    const hasOnlineSlots = onlineSlots.some((s) => s.count > 0);
    const hasRealSlots = realSlots.some((s) => s.count > 0);

    if (hasOnlineSlots && !onlineRoundId) {
      Alert.alert('エラー', `第${store.roundNumber}次のオンライン受付データが見つかりません。DB に受付次を追加してください。`);
      return;
    }
    if (hasRealSlots && !realRoundId) {
      Alert.alert('エラー', `第${store.roundNumber}次のリアル受付データが見つかりません。DB に受付次を追加してください。`);
      return;
    }

    setIsSubmitting(true);

    // ⚠️ CRITICAL TODO (v2): Supabase RPC に移行し、全テーブルへの書き込みを 1 トランザクションにまとめる。
    // 途中失敗で round_applications が DELETE されたまま復元されないリスクあり。
    try {
      const onlineItems = onlineSlots
        .filter((s) => s.count > 0)
        .map((slot) => ({
          event_slot_id: slot.eventSlotId,
          member_id: memberId,
          applied_count: slot.count,
        }));

      const realItems = realSlots
        .filter((s) => s.count > 0)
        .map((slot) => ({
          event_slot_id: slot.eventSlotId,
          member_id: memberId,
          applied_count: slot.count,
        }));

      const allItems = [...onlineItems, ...realItems];

      if (allItems.length === 0) {
        Alert.alert('エラー', '申込みデータがありません');
        return;
      }

      // フォーマット別に登録・UPSERT を実行
      const formatGroups: { roundId: string; items: typeof allItems }[] = [];
      if (onlineItems.length > 0 && onlineRoundId) {
        formatGroups.push({ roundId: onlineRoundId, items: onlineItems });
      }
      if (realItems.length > 0 && realRoundId) {
        formatGroups.push({ roundId: realRoundId, items: realItems });
      }

      for (const group of formatGroups) {
        // 1. 登録スナップショットを作成
        const { data: registration, error: regError } = await supabase
          .from('registrations')
          .insert({ user_id: user.id, reception_round_id: group.roundId })
          .select('id')
          .single();
        if (regError) throw regError;

        // 2. 登録内容を保存 (スナップショット)
        const { error: itemsError } = await supabase
          .from('registration_items')
          .insert(
            group.items.map((item) => ({
              registration_id: registration.id,
              ...item,
            })),
          );
        if (itemsError) throw itemsError;

        // 3. 既存の round_applications を削除 (ユーザーが削除したスロットを反映)
        const { error: deleteError } = await supabase
          .from('round_applications')
          .delete()
          .eq('user_id', user.id)
          .eq('reception_round_id', group.roundId);
        if (deleteError) throw deleteError;

        // 4. 集約テーブルを UPSERT (最新状態)
        const { error: upsertError } = await supabase
          .from('round_applications')
          .upsert(
            group.items.map((item) => ({
              user_id: user.id,
              reception_round_id: group.roundId,
              ...item,
            })),
            { onConflict: 'user_id,reception_round_id,event_slot_id,member_id' },
          );
        if (upsertError) throw upsertError;

        // 5. 既存の round_application_rates を削除 (再登録時に古いメンバー分を除去)
        const { error: deleteRateError } = await supabase
          .from('round_application_rates')
          .delete()
          .eq('user_id', user.id)
          .eq('reception_round_id', group.roundId);
        if (deleteRateError) throw deleteRateError;
      }

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
        {/* 使用済みシリアルコード */}
        <View className="rounded-xl border border-border bg-white p-4 mb-4">
          <Text className="text-sm font-semibold text-text mb-2">
            使用済みシリアルコード
          </Text>
          <View className="flex-row justify-between">
            <Text className="text-sm text-text-muted">
              このイベントで当選済みの枠
            </Text>
            <Text className="text-sm text-text">{usedSerials}枚</Text>
          </View>
        </View>

        {/* 今回の申込み */}
        <Text className="text-sm font-semibold text-text mb-2 ml-1">
          今回の申込み
        </Text>

        {onlineSlots.length > 0 && (
          <View className="rounded-xl border border-border bg-white p-4 mb-3">
            <View className="flex-row items-center mb-3">
              <View className="bg-primary-soft rounded-full px-2.5 py-0.5 mr-2">
                <Text className="text-xs font-medium text-text">
                  初回限定オンライン
                </Text>
              </View>
              <Text className="text-sm text-text-muted">
                {onlineCount}枚
              </Text>
            </View>
            {onlineSlots.map((slot) => (
              <View
                key={slot.eventSlotId}
                className="flex-row items-center py-1.5 border-b border-divider"
              >
                <Text className="text-sm text-text-muted flex-1">
                  DAY{slot.dayNumber} {slot.slotNumber}部
                </Text>
                <Text className="text-sm text-text">{slot.count}枚</Text>
              </View>
            ))}
          </View>
        )}

        {realSlots.length > 0 && (
          <View className="rounded-xl border border-border bg-white p-4 mb-3">
            <View className="flex-row items-center mb-3">
              <View className="bg-orange-100 rounded-full px-2.5 py-0.5 mr-2">
                <Text className="text-xs font-medium text-orange-800">
                  リアルミーグリ
                </Text>
              </View>
              <Text className="text-sm text-text-muted">
                {realCount}枚
              </Text>
            </View>
            {realSlots.map((slot) => (
              <View
                key={slot.eventSlotId}
                className="flex-row items-center py-1.5 border-b border-divider"
              >
                <Text className="text-sm text-text-muted flex-1">
                  DAY{slot.dayNumber} {slot.slotNumber}部
                </Text>
                <Text className="text-sm text-text">{slot.count}枚</Text>
              </View>
            ))}
          </View>
        )}

        {totalNewSerials === 0 && (
          <View className="rounded-xl border border-border bg-white p-4 mb-3">
            <Text className="text-sm text-text-muted text-center">
              申込みデータがありません
            </Text>
          </View>
        )}

        {/* 合計カード */}
        {totalNewSerials > 0 && (
          <View className="rounded-xl bg-surface p-4 mb-4">
            <View className="flex-row justify-between py-1">
              <Text className="text-sm text-text-muted">
                使用済みシリアルコード
              </Text>
              <Text className="text-sm text-text">{usedSerials}枚</Text>
            </View>
            <View className="flex-row justify-between py-1">
              <Text className="text-sm text-text-muted">今回の申込み</Text>
              <Text className="text-sm text-text">
                {totalNewSerials}枚
              </Text>
            </View>
            <View className="flex-row justify-between py-1 border-t border-primary mt-1 pt-2">
              <Text className="text-base font-bold text-text">
                合計シリアルコード数
              </Text>
              <Text className="text-base font-bold text-text">
                {totalSerials}枚
              </Text>
            </View>
          </View>
        )}

        <Button
          label="登録する"
          isDisabled={totalNewSerials === 0}
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
