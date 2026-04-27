import type { FC, ReactNode } from 'react';

import { Redirect } from 'expo-router';
import { View, Text, ScrollView } from 'react-native';

import { Button } from '@/components/Button';
import { EventDayCard } from '@/components/EventDayCard';
import { MemberChip } from '@/components/MemberChip';

type SectionProps = {
  title: string;
  children: ReactNode;
};

const Section: FC<SectionProps> = ({ title, children }) => {
  return (
    <View className="mb-6">
      <Text className="mb-3 text-lg font-bold text-gray-700">{title}</Text>
      <View className="flex-row flex-wrap gap-3">{children}</View>
    </View>
  );
};

const MOCK_MEMBER = {
  id: 'm1',
  name: '正源司陽子',
  generation: 4,
  birthday: '2007-02-14',
  created_at: '2026-01-01T00:00:00Z',
  updated_at: '2026-01-01T00:00:00Z',
};

const MOCK_MEMBERS = [
  MOCK_MEMBER,
  { ...MOCK_MEMBER, id: 'm2', name: '坂井新奈', generation: 5 },
  { ...MOCK_MEMBER, id: 'm3', name: '金村美玖', generation: 2 },
];

const MOCK_SLOT = (id: string, num: number, startH: number, endH: number) => ({
  id,
  event_day_id: 'day-1',
  slot_number: num,
  starts_at: `2026-05-31T${String(startH).padStart(2, '0')}:00:00Z`,
  ends_at: `2026-05-31T${String(endH).padStart(2, '0')}:00:00Z`,
  created_at: '2026-01-01T00:00:00Z',
  updated_at: '2026-01-01T00:00:00Z',
});

const MOCK_EVENT_DAY = {
  id: 'day-1',
  event_id: 'event-1',
  day_number: 1,
  date: '2026-05-31',
  created_at: '2026-01-01T00:00:00Z',
  updated_at: '2026-01-01T00:00:00Z',
  event_slots: [
    MOCK_SLOT('s1', 1, 2, 3),
    MOCK_SLOT('s2', 2, 3, 4),
    MOCK_SLOT('s3', 3, 5, 6),
  ],
  event_day_members: MOCK_MEMBERS.map((m) => ({
    event_day_id: 'day-1',
    member_id: m.id,
    created_at: '2026-01-01T00:00:00Z',
    updated_at: '2026-01-01T00:00:00Z',
    members: m,
  })),
};

export default function CatalogScreen() {
  if (!__DEV__) {
    return <Redirect href="/" />;
  }

  return (
    <ScrollView className="flex-1 bg-white p-6">
      <Text className="mb-6 text-2xl font-bold text-gray-900">
        コンポーネントカタログ
      </Text>

      <Section title="Button — バリエーション">
        <Button label="プライマリ" variant="primary" />
        <Button label="セカンダリ" variant="secondary" />
        <Button label="アウトライン" variant="outline" />
      </Section>

      <Section title="Button — サイズ">
        <Button label="小" size="sm" />
        <Button label="中" size="md" />
        <Button label="大" size="lg" />
      </Section>

      <Section title="Button — 状態">
        <Button label="通常" />
        <Button label="無効" isDisabled />
        <Button label="読み込み中" isLoading />
      </Section>

      <Section title="MemberChip">
        {MOCK_MEMBERS.map((m) => (
          <MemberChip key={m.id} member={m} />
        ))}
      </Section>

      <Section title="EventDayCard">
        <View className="w-full">
          <EventDayCard eventDay={MOCK_EVENT_DAY} />
        </View>
      </Section>
    </ScrollView>
  );
}
