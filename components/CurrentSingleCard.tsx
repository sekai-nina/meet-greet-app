import type { FC } from 'react';
import { ImageBackground, Text, TouchableOpacity, View } from 'react-native';

import type { ImageSourcePropType } from 'react-native';

type StatItemProps = {
  value: string;
  label: string;
};

const StatItem: FC<StatItemProps> = ({ value, label }) => (
  <View className="items-center flex-1">
    <Text className="text-xl font-bold text-white">{value}</Text>
    <Text className="text-xs text-white/70">{label}</Text>
  </View>
);

type CurrentSingleCardProps = {
  releaseNumber: number;
  releaseTitle: string;
  totalWon: number;
  totalApplied: number;
  usedSerials: number;
  pendingSerials: number;
  onPressDetail: () => void;
  backgroundImage?: ImageSourcePropType;
};

export const CurrentSingleCard: FC<CurrentSingleCardProps> = ({
  releaseNumber,
  releaseTitle,
  totalWon,
  totalApplied,
  usedSerials,
  pendingSerials,
  onPressDetail,
  backgroundImage,
}) => {
  const content = (
    <>
      {/* 上部: 詳細リンク */}
      <View className="flex-row justify-end">
        <TouchableOpacity
          onPress={onPressDetail}
          accessibilityRole="button"
          accessibilityLabel="詳細"
        >
          <Text className="text-sm text-blue-300">詳細 →</Text>
        </TouchableOpacity>
      </View>

      <View className="flex-1" />

      {/* 下部: リリース情報 + 統計 */}
      <View>
        <Text className="text-sm text-white/70">
          {releaseNumber}thシングル
        </Text>
        <Text className="text-xl font-bold text-white mb-3">
          {releaseTitle}
        </Text>
        <View className="flex-row border-t border-white/20 pt-3">
          <StatItem value={String(totalWon)} label="当選枠" />
          <StatItem value={String(totalApplied)} label="申込枠" />
          <StatItem value={String(usedSerials)} label="当選シリアル" />
          <StatItem value={String(pendingSerials)} label="申込中シリアル" />
        </View>
      </View>
    </>
  );

  if (backgroundImage) {
    return (
      <View className="mx-4 mt-4 rounded-xl overflow-hidden">
        <ImageBackground
          source={backgroundImage}
          resizeMode="cover"
          className="w-full"
          style={{ aspectRatio: 9 / 4 }}
        >
          <View className="flex-1 bg-black/50 p-5 justify-end">
            {content}
          </View>
        </ImageBackground>
      </View>
    );
  }

  return (
    <View className="rounded-xl bg-slate-800 p-5 mx-4 mt-4">{content}</View>
  );
};
