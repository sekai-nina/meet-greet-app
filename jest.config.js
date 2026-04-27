module.exports = {
  preset: 'jest-expo',
  passWithNoTests: true,
  transformIgnorePatterns: [
    'node_modules/(?!((jest-)?react-native|@react-native(-community)?)|expo(nent)?|@expo(nent)?/.*|@expo-google-fonts/.*|react-navigation|@react-navigation/.*|@sentry/sentry-expo|native-base|react-native-svg|nativewind)',
  ],
};
