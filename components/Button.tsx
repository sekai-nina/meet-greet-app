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
  primary: 'bg-primary active:bg-primary/80',
  secondary: 'bg-text-muted active:bg-text',
  outline: 'border-2 border-primary bg-transparent active:bg-primary-soft',
};

const SIZE_CLASSES: Record<ButtonSize, string> = {
  sm: 'px-3 py-1.5',
  md: 'px-4 py-2.5',
  lg: 'px-6 py-3.5',
};

const TEXT_VARIANT_CLASSES: Record<ButtonVariant, string> = {
  primary: 'text-text',
  secondary: 'text-white',
  outline: 'text-primary',
};

const TEXT_SIZE_CLASSES: Record<ButtonSize, string> = {
  sm: 'text-sm',
  md: 'text-base',
  lg: 'text-lg',
};

const INDICATOR_COLOR: Record<ButtonVariant, string> = {
  primary: '#14253A',
  secondary: '#ffffff',
  outline: '#5BBEE5',
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
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled: isInactive, busy: isLoading }}
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
