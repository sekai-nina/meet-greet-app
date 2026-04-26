import { Redirect } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function StorybookScreen() {
  if (!__DEV__) {
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
