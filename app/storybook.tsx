import { Redirect } from 'expo-router';

import StorybookUI from '../.rnstorybook';

export default function StorybookScreen() {
  if (!__DEV__) {
    return <Redirect href="/" />;
  }

  return <StorybookUI />;
}
