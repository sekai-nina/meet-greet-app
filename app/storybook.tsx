import { Redirect } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

const IS_STORYBOOK_ENABLED =
  __DEV__ && process.env.EXPO_PUBLIC_STORYBOOK_ENABLED === 'true';

export default function StorybookScreen() {
  if (!IS_STORYBOOK_ENABLED) {
    return <Redirect href="/" />;
  }

  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const StorybookUI = require('../.rnstorybook').default;

  return (
    <SafeAreaView style={{ flex: 1 }} edges={['top', 'bottom', 'left', 'right']}>
      <StorybookUI />
    </SafeAreaView>
  );
}
