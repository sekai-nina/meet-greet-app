---
paths:
  - app/**/*.tsx
  - components/**/*.tsx
---

# React Native / Expo Rules

## コンポーネント定義

- 関数コンポーネント + `const` で定義する (e.g., `const EventList: FC<Props> = ...`)

## スタイリング

- NativeWind (`className`) を第一候補とする
- 複雑・再利用性の高いスタイルやパフォーマンスが重要な箇所では `StyleSheet.create` も許可する
- ハードコードされた色・サイズは使わない。NativeWind のテーマまたは定数で管理する

## 画面コンポーネント (app/ 配下)

- データ取得とレイアウトに集中し、ビジネスロジックはカスタムフックに切り出す

## リスト表示

- `FlatList` または `FlashList` を使う
- `ScrollView` + `map` によるリスト表示は禁止

## ナビゲーション

- 通常遷移: `expo-router` の `Link` コンポーネントまたは `router.navigate()` を使う
- 履歴を積み増す必要がある場合のみ `router.push()` を使う

## New Architecture

- 依存ライブラリ採用時は New Architecture 対応を確認する
- `npx expo doctor` を定期的に実行し、互換性の問題を早期検出する
