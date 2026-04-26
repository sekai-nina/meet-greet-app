import { Redirect } from 'expo-router';
import { View, Text, ScrollView } from 'react-native';

import { Button } from '@/components/Button';

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View className="mb-6">
      <Text className="mb-3 text-lg font-bold text-gray-700">{title}</Text>
      <View className="flex-row flex-wrap gap-3">{children}</View>
    </View>
  );
}

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
        <Button label="Primary" variant="primary" />
        <Button label="Secondary" variant="secondary" />
        <Button label="Outline" variant="outline" />
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
    </ScrollView>
  );
}
