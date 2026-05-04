import type { FC } from 'react';
import { Text, TouchableOpacity } from 'react-native';

import { useRouter } from 'expo-router';

export const BackButton: FC = () => {
  const router = useRouter();

  return (
    <TouchableOpacity
      onPress={() => router.back()}
      style={{ marginLeft: -4 }}
      accessibilityRole="button"
      accessibilityLabel="戻る"
    >
      <Text style={{ fontSize: 16, color: '#5BBEE5' }}>‹ 戻る</Text>
    </TouchableOpacity>
  );
};
