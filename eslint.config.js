// https://docs.expo.dev/guides/using-eslint/
const { defineConfig } = require('eslint/config');
const expoConfig = require('eslint-config-expo/flat');

module.exports = defineConfig([
  expoConfig,
  {
    ignores: ['dist/*'],
  },
  {
    files: ['app/**/*.{ts,tsx}'],
    rules: {
      'no-restricted-imports': [
        'warn',
        {
          paths: [
            {
              name: 'react-native',
              importNames: ['ActivityIndicator'],
              message:
                '画面レベルの読み込み表示には LoadingSpinner を使ってください。ActivityIndicator はボタン等の局所的な用途でのみ許可されています。',
            },
          ],
        },
      ],
    },
  },
]);
