import { Text, TouchableOpacity, View } from 'react-native';

import { useRouter } from 'expo-router';
import { Monitor, Star } from 'phosphor-react-native';

import { useLatestRelease } from '@/hooks/use-latest-release';
import { useApplyFormStore } from '@/stores/apply-form-store';

export default function ApplyTypeScreen() {
  const router = useRouter();
  const { data: release } = useLatestRelease();
  const setCdType = useApplyFormStore((s) => s.setCdType);
  const reset = useApplyFormStore((s) => s.reset);

  const handleSelect = (type: 'regular' | 'limited') => {
    reset();
    setCdType(type);
    if (type === 'regular') {
      router.push('/(app)/home/apply-regular');
    } else {
      router.push('/(app)/home/apply-limited');
    }
  };

  return (
    <View className="flex-1 bg-bg px-5 pt-8">
      <Text className="text-xl font-bold text-text mb-2">
        申込みの種別を選択
      </Text>
      <Text className="text-sm text-text-muted mb-6">
        {release
          ? `${release.number}thシングル「${release.title}」`
          : ''}
      </Text>

      {/* 通常盤 */}
      <TouchableOpacity
        className="rounded-xl border border-border bg-white p-5 mb-4"
        onPress={() => handleSelect('regular')}
        accessibilityRole="button"
        accessibilityLabel="通常盤 オンラインミーグリ"
      >
        <View className="flex-row items-center mb-2">
          <View className="w-10 h-10 rounded-xl bg-primary-soft items-center justify-center mr-3">
            <Monitor size={24} color="#5BBEE5" />
          </View>
          <View className="flex-1">
            <Text className="text-base font-bold text-text">
              通常盤 オンラインミーグリ
            </Text>
            <Text className="text-xs text-text-muted mt-0.5">
              forTUNE music で申込み
            </Text>
          </View>
          <Text className="text-gray-300 text-lg">›</Text>
        </View>
        <Text className="text-xs text-gray-400 ml-[52px]">
          全6日程 · 各6部
        </Text>
      </TouchableOpacity>

      {/* 初回限定盤 */}
      <TouchableOpacity
        className="rounded-xl border border-border bg-white p-5"
        onPress={() => handleSelect('limited')}
        accessibilityRole="button"
        accessibilityLabel="初回限定盤 ミーグリ"
      >
        <View className="flex-row items-center mb-2">
          <View className="w-10 h-10 rounded-xl bg-accent-soft items-center justify-center mr-3">
            <Star size={24} color="#F59E0B" weight="fill" />
          </View>
          <View className="flex-1">
            <Text className="text-base font-bold text-text">
              初回限定盤 ミーグリ
            </Text>
            <Text className="text-xs text-text-muted mt-0.5">
              初回限定盤CDのシリアルで申込み
            </Text>
          </View>
          <Text className="text-gray-300 text-lg">›</Text>
        </View>
        <Text className="text-xs text-gray-400 ml-[52px]">
          オンライン · リアル · 1日程
        </Text>
      </TouchableOpacity>
    </View>
  );
}
