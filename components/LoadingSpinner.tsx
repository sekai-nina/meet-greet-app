import type { FC } from 'react';
import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';

import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

type SpinnerSize = 'sm' | 'md' | 'lg';

type LoadingSpinnerProps = {
  size?: SpinnerSize;
  color?: string;
};

const DEFAULT_COLOR = '#5BBEE5';

const TRIANGLE_SIZE: Record<SpinnerSize, number> = {
  sm: 18,
  md: 28,
  lg: 44,
};

const GAP: Record<SpinnerSize, number> = {
  sm: 14,
  md: 22,
  lg: 34,
};

const TRIANGLE_COUNT = 3;
const CYCLE_DURATION_MS = 3000;
const STAGGER_DELAY_MS = CYCLE_DURATION_MS / TRIANGLE_COUNT;

// キーフレーム: タメ → オーバーシュート回転 → 着地 → 静止
const WINDUP_ROTATION_DEG = -18;
const OVERSHOOT_ROTATION_DEG = 390;
const FULL_ROTATION_DEG = 360;
const WINDUP_SCALE = 0.85;
const OVERSHOOT_SCALE = 1.22;
const REST_SCALE = 1;

const WINDUP_END = 0.05;
const OVERSHOOT_END = 0.21;
const SETTLE_END = 0.27;

const WINDUP_DURATION_MS = CYCLE_DURATION_MS * WINDUP_END;
const SPIN_DURATION_MS = CYCLE_DURATION_MS * (OVERSHOOT_END - WINDUP_END);
const SETTLE_DURATION_MS = CYCLE_DURATION_MS * (SETTLE_END - OVERSHOOT_END);
const HOLD_DURATION_MS = CYCLE_DURATION_MS * (1 - SETTLE_END);

const EASING = Easing.bezier(0.5, 0, 0.3, 1);

type TriangleProps = {
  triangleSize: number;
  color: string;
  delay: number;
};

const Triangle: FC<TriangleProps> = ({ triangleSize, color, delay }) => {
  const rotation = useSharedValue(0);
  const scale = useSharedValue(1);

  useEffect(() => {
    rotation.value = withDelay(
      delay,
      withRepeat(
        withSequence(
          withTiming(WINDUP_ROTATION_DEG, { duration: WINDUP_DURATION_MS, easing: EASING }),
          withTiming(OVERSHOOT_ROTATION_DEG, { duration: SPIN_DURATION_MS, easing: EASING }),
          withTiming(FULL_ROTATION_DEG, { duration: SETTLE_DURATION_MS, easing: EASING }),
          withTiming(FULL_ROTATION_DEG, { duration: HOLD_DURATION_MS }),
          // リセット
          withTiming(0, { duration: 0 }),
        ),
        -1,
      ),
    );

    scale.value = withDelay(
      delay,
      withRepeat(
        withSequence(
          withTiming(WINDUP_SCALE, { duration: WINDUP_DURATION_MS, easing: EASING }),
          withTiming(OVERSHOOT_SCALE, { duration: SPIN_DURATION_MS, easing: EASING }),
          withTiming(REST_SCALE, { duration: SETTLE_DURATION_MS, easing: EASING }),
          withTiming(REST_SCALE, { duration: HOLD_DURATION_MS }),
          withTiming(REST_SCALE, { duration: 0 }),
        ),
        -1,
      ),
    );
  }, [delay, rotation, scale]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { rotate: `${rotation.value}deg` },
      { scale: scale.value },
    ],
  }));

  // 直角二等辺三角形 ◣ 型: 左下が直角
  const triangleStyle = {
    width: 0,
    height: 0,
    borderLeftWidth: triangleSize,
    borderBottomWidth: triangleSize,
    borderRightWidth: 0,
    borderTopWidth: 0,
    borderLeftColor: 'transparent',
    borderBottomColor: color,
    borderRightColor: 'transparent',
    borderTopColor: 'transparent',
  };

  return (
    <Animated.View style={animatedStyle}>
      <View style={triangleStyle} />
    </Animated.View>
  );
};

export const LoadingSpinner: FC<LoadingSpinnerProps> = ({
  size = 'md',
  color = DEFAULT_COLOR,
}) => {
  const triangleSize = TRIANGLE_SIZE[size];
  const gap = GAP[size];

  return (
    <View
      accessible
      accessibilityRole="progressbar"
      accessibilityLabel="読み込み中"
      accessibilityState={{ busy: true }}
      style={[styles.container, { gap }]}
    >
      {Array.from({ length: TRIANGLE_COUNT }, (_, i) => (
        <Triangle
          key={i}
          triangleSize={triangleSize}
          color={color}
          delay={i * STAGGER_DELAY_MS}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
