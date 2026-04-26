import { useState } from 'react';

import {
  ActivityIndicator,
  Alert,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import { useAuthStore } from '@/stores/auth-store';

type LoginStep = 'email' | 'otp';

export default function LoginScreen() {
  const [step, setStep] = useState<LoginStep>('email');
  const [email, setEmail] = useState('');
  const [otpToken, setOtpToken] = useState('');

  const isLoading = useAuthStore((s) => s.isLoading);
  const signInWithOtp = useAuthStore((s) => s.signInWithOtp);
  const verifyOtp = useAuthStore((s) => s.verifyOtp);
  const signInAnonymously = useAuthStore((s) => s.signInAnonymously);

  const handleSendMagicLink = async () => {
    if (!email.trim()) {
      Alert.alert('エラー', 'メールアドレスを入力してください');
      return;
    }

    const { error } = await signInWithOtp(email.trim());
    if (error) {
      Alert.alert('エラー', '認証コードの送信に失敗しました');
      return;
    }

    setStep('otp');
  };

  const handleVerifyOtp = async () => {
    if (!otpToken.trim()) {
      Alert.alert('エラー', '認証コードを入力してください');
      return;
    }

    const { error } = await verifyOtp(email.trim(), otpToken.trim());
    if (error) {
      Alert.alert('エラー', '認証コードが正しくありません');
    }
  };

  const handleAnonymousLogin = async () => {
    const { error } = await signInAnonymously();
    if (error) {
      Alert.alert('エラー', '匿名ログインに失敗しました');
    }
  };

  return (
    <View className="flex-1 justify-center px-8 bg-white">
      <Text className="text-3xl font-bold text-center mb-2">ミーグリ記録</Text>
      <Text className="text-base text-gray-500 text-center mb-10">
        日向坂46 ミート&グリート管理
      </Text>

      {step === 'email' ? (
        <>
          <TextInput
            className="border border-gray-300 rounded-lg px-4 py-3 mb-4 text-base"
            placeholder="メールアドレス"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
            editable={!isLoading}
          />

          <TouchableOpacity
            className="bg-blue-600 rounded-lg py-3 mb-3"
            onPress={() => void handleSendMagicLink()}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text className="text-white text-center font-semibold text-base">
                認証コードを送信
              </Text>
            )}
          </TouchableOpacity>

          <View className="flex-row items-center my-4">
            <View className="flex-1 h-px bg-gray-300" />
            <Text className="mx-4 text-gray-500">または</Text>
            <View className="flex-1 h-px bg-gray-300" />
          </View>

          <TouchableOpacity
            className="border border-gray-300 rounded-lg py-3"
            onPress={() => void handleAnonymousLogin()}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="gray" />
            ) : (
              <Text className="text-gray-700 text-center font-semibold text-base">
                匿名でログイン
              </Text>
            )}
          </TouchableOpacity>
        </>
      ) : (
        <>
          <Text className="text-sm text-gray-600 mb-4 text-center">
            {email} に認証コードを送信しました
          </Text>

          <TextInput
            className="border border-gray-300 rounded-lg px-4 py-3 mb-4 text-base text-center tracking-widest"
            placeholder="認証コード (6桁)"
            value={otpToken}
            onChangeText={setOtpToken}
            keyboardType="number-pad"
            maxLength={6}
            editable={!isLoading}
          />

          <TouchableOpacity
            className="bg-blue-600 rounded-lg py-3 mb-3"
            onPress={() => void handleVerifyOtp()}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text className="text-white text-center font-semibold text-base">
                認証する
              </Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity onPress={() => setStep('email')}>
            <Text className="text-blue-600 text-center text-sm">
              メールアドレスを変更する
            </Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
}
