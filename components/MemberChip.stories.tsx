import type { Meta, StoryObj } from '@storybook/react-native';

import { View } from 'react-native';

import { MemberChip } from './MemberChip';

const meta = {
  title: 'components/MemberChip',
  component: MemberChip,
  decorators: [
    (Story) => (
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', padding: 16 }}>
        <Story />
      </View>
    ),
  ],
} satisfies Meta<typeof MemberChip>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    member: {
      id: '1',
      name: '正源司陽子',
      generation: 4,
      birthday: '2007-02-14',
      created_at: '2026-01-01T00:00:00Z',
      updated_at: '2026-01-01T00:00:00Z',
    },
  },
};

export const ShortName: Story = {
  args: {
    member: {
      id: '2',
      name: '松尾桜',
      generation: 5,
      birthday: '2005-06-08',
      created_at: '2026-01-01T00:00:00Z',
      updated_at: '2026-01-01T00:00:00Z',
    },
  },
};

export const LongName: Story = {
  args: {
    member: {
      id: '3',
      name: '蔵盛妃那乃',
      generation: 5,
      birthday: '2006-01-23',
      created_at: '2026-01-01T00:00:00Z',
      updated_at: '2026-01-01T00:00:00Z',
    },
  },
};
