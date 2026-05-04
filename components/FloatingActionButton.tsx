import type { FC } from 'react';
import { TouchableOpacity } from 'react-native';

import { Plus } from 'phosphor-react-native';

type FloatingActionButtonProps = {
  onPress: () => void;
};

const FAB_MARGIN = 8;
const FAB_SIZE = 56;

export const FloatingActionButton: FC<FloatingActionButtonProps> = ({
  onPress,
}) => (
  <TouchableOpacity
    className="absolute right-4 items-center justify-center rounded-full bg-primary shadow-lg"
    style={{ bottom: FAB_MARGIN, width: FAB_SIZE, height: FAB_SIZE }}
    onPress={onPress}
    accessibilityRole="button"
    accessibilityLabel="申込む"
    activeOpacity={0.8}
  >
    <Plus size={28} color="#14253A" weight="bold" />
  </TouchableOpacity>
);
