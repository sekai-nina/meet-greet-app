import type { FC } from 'react';
import { ActivityIndicator, Pressable, Text } from 'react-native';

type ButtonVariant = 'primary' | 'secondary' | 'outline';
type ButtonSize = 'sm' | 'md' | 'lg';

type ButtonProps = {
  label: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  isDisabled?: boolean;
  isLoading?: boolean;
  onPress?: () => void;
};

const VARIANT_CLASSES: Record<ButtonVariant, string> = {
  primary: 'bg-blue-600 active:bg-blue-700',
  secondary: 'bg-gray-600 active:bg-gray-700',
  outline: 'border-2 border-blue-600 bg-transparent active:bg-blue-50',
};

const SIZE_CLASSES: Record<ButtonSize, string> = {
  sm: 'px-3 py-1.5',
  md: 'px-4 py-2.5',
  lg: 'px-6 py-3.5',
};

const TEXT_VARIANT_CLASSES: Record<ButtonVariant, string> = {
  primary: 'text-white',
  secondary: 'text-white',
  outline: 'text-blue-600',
};

const TEXT_SIZE_CLASSES: Record<ButtonSize, string> = {
  sm: 'text-sm',
  md: 'text-base',
  lg: 'text-lg',
};

const INDICATOR_COLOR: Record<ButtonVariant, string> = {
  primary: '#ffffff',
  secondary: '#ffffff',
  outline: '#2563eb',
};

export const Button: FC<ButtonProps> = ({
  label,
  variant = 'primary',
  size = 'md',
  isDisabled = false,
  isLoading = false,
  onPress,
}) => {
  const isInactive = isDisabled || isLoading;

  return (
    <Pressable
      role="button"
      accessibilityState={{ disabled: isInactive }}
      disabled={isInactive}
      onPress={onPress}
      className={`items-center justify-center rounded-lg ${VARIANT_CLASSES[variant]} ${SIZE_CLASSES[size]} ${isInactive ? 'opacity-50' : ''}`}
    >
      {isLoading ? (
        <ActivityIndicator
          size="small"
          color={INDICATOR_COLOR[variant]}
        />
      ) : (
        <Text
          className={`font-semibold ${TEXT_VARIANT_CLASSES[variant]} ${TEXT_SIZE_CLASSES[size]}`}
        >
          {label}
        </Text>
      )}
    </Pressable>
  );
};
