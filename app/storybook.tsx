import { Redirect } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

import StorybookUI from '../.rnstorybook';

export default function StorybookScreen() {
  if (!__DEV__) {
    return <Redirect href="/" />;
  }

  return (
    <SafeAreaView style={{ flex: 1 }} edges={['top', 'bottom', 'left', 'right']}>
      <StorybookUI />
    </SafeAreaView>
  );
}
