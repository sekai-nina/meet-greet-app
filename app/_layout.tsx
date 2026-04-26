import '../global.css';

import { Stack } from 'expo-router';

const IS_STORYBOOK_ENABLED =
  __DEV__ && process.env.EXPO_PUBLIC_STORYBOOK_ENABLED === 'true';

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: 'ミーグリ記録' }} />
      {IS_STORYBOOK_ENABLED && (
        <Stack.Screen name="storybook" options={{ headerShown: false }} />
      )}
      {__DEV__ && (
        <Stack.Screen
          name="catalog"
          options={{ title: 'コンポーネントカタログ' }}
        />
      )}
    </Stack>
  );
}
