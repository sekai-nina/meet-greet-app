import type { Meta, StoryObj } from '@storybook/react-native';

import { ScrollView } from 'react-native';

import { EventDayCard } from './EventDayCard';

const mockMember = (id: string, name: string, generation: number) => ({
  id,
  name,
  generation,
  birthday: '2005-01-01',
  created_at: '2026-01-01T00:00:00Z',
  updated_at: '2026-01-01T00:00:00Z',
});

const mockSlot = (
  id: string,
  slotNumber: number,
  startHourUtc: number,
  endHourUtc: number,
) => ({
  id,
  event_day_id: 'day-1',
  slot_number: slotNumber,
  starts_at: `2026-05-31T${String(startHourUtc).padStart(2, '0')}:00:00Z`,
  ends_at: `2026-05-31T${String(endHourUtc).padStart(2, '0')}:00:00Z`,
  created_at: '2026-01-01T00:00:00Z',
  updated_at: '2026-01-01T00:00:00Z',
});

const mockEdm = (memberId: string, name: string, generation: number) => ({
  event_day_id: 'day-1',
  member_id: memberId,
  created_at: '2026-01-01T00:00:00Z',
  updated_at: '2026-01-01T00:00:00Z',
  members: mockMember(memberId, name, generation),
});

const SAMPLE_MEMBERS = [
  mockEdm('m1', '正源司陽子', 4),
  mockEdm('m2', '藤嶌果歩', 4),
  mockEdm('m3', '坂井新奈', 5),
  mockEdm('m4', '金村美玖', 2),
  mockEdm('m5', '上村ひなの', 3),
];

const SAMPLE_SLOTS = [
  mockSlot('s1', 1, 2, 3),
  mockSlot('s2', 2, 3, 4),
  mockSlot('s3', 3, 5, 6),
  mockSlot('s4', 4, 7, 8),
  mockSlot('s5', 5, 8, 9),
  mockSlot('s6', 6, 10, 11),
];

const meta = {
  title: 'components/EventDayCard',
  component: EventDayCard,
  decorators: [
    (Story) => (
      <ScrollView style={{ padding: 16 }}>
        <Story />
      </ScrollView>
    ),
  ],
} satisfies Meta<typeof EventDayCard>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    eventDay: {
      id: 'day-1',
      event_id: 'event-1',
      day_number: 1,
      date: '2026-05-31',
      created_at: '2026-01-01T00:00:00Z',
      updated_at: '2026-01-01T00:00:00Z',
      event_slots: SAMPLE_SLOTS,
      event_day_members: SAMPLE_MEMBERS,
    },
  },
};

export const FewMembers: Story = {
  args: {
    eventDay: {
      id: 'day-2',
      event_id: 'event-1',
      day_number: 3,
      date: '2026-07-05',
      created_at: '2026-01-01T00:00:00Z',
      updated_at: '2026-01-01T00:00:00Z',
      event_slots: SAMPLE_SLOTS.slice(0, 2),
      event_day_members: SAMPLE_MEMBERS.slice(0, 2),
    },
  },
};

export const SingleSlot: Story = {
  args: {
    eventDay: {
      id: 'day-3',
      event_id: 'event-1',
      day_number: 6,
      date: '2026-08-09',
      created_at: '2026-01-01T00:00:00Z',
      updated_at: '2026-01-01T00:00:00Z',
      event_slots: [mockSlot('s1', 1, 2, 3)],
      event_day_members: [mockEdm('m1', '正源司陽子', 4)],
    },
  },
};
