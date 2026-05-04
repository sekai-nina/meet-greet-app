import { useState } from 'react';

import {
  ActivityIndicator, // eslint-disable-line no-restricted-imports -- ボタン内インジケータ
  Alert,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import { useAuth } from '@/hooks/use-auth';
import { useAuthStore } from '@/stores/auth-store';

export default function SettingsTab() {
  const { user, isAnonymous } = useAuth();
  const signOut = useAuthStore((s) => s.signOut);
  const linkEmail = useAuthStore((s) => s.linkEmail);
  const isLoading = useAuthStore((s) => s.isLoading);
  const [email, setEmail] = useState('');

  const handleLinkEmail = async () => {
    if (!email.trim()) {
      Alert.alert('エラー', 'メールアドレスを入力してください');
      return;
    }
    const { error } = await linkEmail(email.trim());
    if (error) {
      Alert.alert('エラー', 'メール連携に失敗しました');
      return;
    }
    Alert.alert('成功', '確認メールを送信しました');
    setEmail('');
  };

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <View className="flex-1 bg-white px-6 pt-8">
      <Text className="text-lg font-bold mb-4">アカウント</Text>

      <View className="bg-bg rounded-lg p-4 mb-6">
        <Text className="text-sm text-text-muted">ステータス</Text>
        <Text className="text-base font-medium mt-1">
          {isAnonymous ? '匿名ユーザー' : user?.email ?? '不明'}
        </Text>
      </View>

      {isAnonymous && (
        <View className="mb-6">
          <Text className="text-base font-semibold mb-2">メール連携</Text>
          <Text className="text-sm text-text-muted mb-3">
            メールアドレスを連携すると、データを安全に保存できます
          </Text>
          <TextInput
            className="border border-border rounded-lg px-4 py-3 mb-3 text-base"
            placeholder="メールアドレス"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
            editable={!isLoading}
          />
          <TouchableOpacity
            className="bg-primary rounded-lg py-3"
            onPress={() => void handleLinkEmail()}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text className="text-white text-center font-semibold">
                メールアドレスを連携
              </Text>
            )}
          </TouchableOpacity>
        </View>
      )}

      <TouchableOpacity
        className="border border-red-300 rounded-lg py-3"
        onPress={() => void handleSignOut()}
      >
        <Text className="text-red-600 text-center font-semibold">
          ログアウト
        </Text>
      </TouchableOpacity>
    </View>
  );
}
