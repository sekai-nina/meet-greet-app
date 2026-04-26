import type { StorybookConfig } from '@storybook/react-vite';

const config: StorybookConfig = {
  stories: ['../components/**/*.stories.tsx'],
  addons: ['@storybook/addon-react-native-web'],
  framework: '@storybook/react-vite',
};

export default config;
