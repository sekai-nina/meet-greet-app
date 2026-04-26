import type { Meta, StoryObj } from '@storybook/react-native';

import { Button } from './Button';

const meta = {
  title: 'components/Button',
  component: Button,
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'outline'],
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
    isDisabled: { control: 'boolean' },
    isLoading: { control: 'boolean' },
  },
} satisfies Meta<typeof Button>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    label: 'ボタン',
  },
};

export const Primary: Story = {
  args: {
    label: '送信する',
    variant: 'primary',
  },
};

export const Secondary: Story = {
  args: {
    label: 'キャンセル',
    variant: 'secondary',
  },
};

export const Outline: Story = {
  args: {
    label: '詳細を見る',
    variant: 'outline',
  },
};

export const Small: Story = {
  args: {
    label: '小',
    size: 'sm',
  },
};

export const Large: Story = {
  args: {
    label: '大きいボタン',
    size: 'lg',
  },
};

export const Disabled: Story = {
  args: {
    label: '無効',
    isDisabled: true,
  },
};

export const Loading: Story = {
  args: {
    label: '読み込み中...',
    isLoading: true,
  },
};
