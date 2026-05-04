import type { FC } from 'react';
import { ActivityIndicator, View } from 'react-native';

type SpinnerSize = 'sm' | 'md' | 'lg';

type LoadingSpinnerProps = {
  size?: SpinnerSize;
  color?: string;
};

const SIZE_MAP: Record<SpinnerSize, 'small' | 'large'> = {
  sm: 'small',
  md: 'large',
  lg: 'large',
};

export const LoadingSpinner: FC<LoadingSpinnerProps> = ({
  size = 'md',
  color = '#5BBEE5',
}) => (
  <View
    accessible
    accessibilityRole="progressbar"
    accessibilityLabel="読み込み中"
    accessibilityState={{ busy: true }}
    style={{ alignItems: 'center', justifyContent: 'center' }}
  >
    <ActivityIndicator size={SIZE_MAP[size]} color={color} />
  </View>
);
