# Copilot Code Review Instructions

このプロジェクトは日向坂46 のミーグリ (ミート&グリート) 管理アプリです。

**レビューコメントはすべて日本語で記述してください。**

## レビューコメントのフォーマット

**すべてのレビューコメントの先頭に、以下の重要度プレフィックスを必ず付けてください:**

- `must:` — セキュリティリスク、バグ、データ損失リスク。マージ前に修正必須
- `should:` — 設計問題、規約違反、パフォーマンス懸念。原則修正
- `may:` — 改善提案、代替案。対応は任意
- `question:` — 設計意図や仕様の確認

例:
```
must: Supabase の service_role key がクライアントコードに露出しています。EXPO_PUBLIC_ 経由でしかアクセスできないようにしてください。

should: この関数は 200 行を超えており、責務が大きすぎます。カスタムフックに分割してください。

may: ここは Optional chaining (`?.`) を使うとより簡潔になります。

question: この状態遷移で cancelled → notApplied に戻るケースはありますか?
```

**重要: 重箱の隅をつつくような指摘は避けてください。** フォーマットの好み、主観的なスタイル指摘、Prettier が管理する範囲の指摘は不要です。

## 修正確認時の振る舞い

指摘した内容が後続のプッシュで修正されていることを確認した場合は、**元のコメントに返信して「修正を確認しました」と明記してください。** これにより PR 作者が conversation を resolve できます。

## 技術スタック

- React Native + Expo (TypeScript strict)
- Expo Router (ファイルベースルーティング)
- Supabase (Auth / Postgres / Row Level Security)
- Zustand + TanStack Query
- NativeWind (Tailwind CSS for React Native)
- mise (ツールバージョン管理)
- dotenvx-rs (環境変数の暗号化管理)

## レビュー時に重視してほしい観点

### セキュリティ (must: で指摘)
- `.env`, `.env.keys` がコミットに含まれていないか
- `EXPO_PUBLIC_` プレフィックスのない環境変数がクライアントコードに含まれていないか
- Supabase の service_role key がクライアント側に露出していないか

### 型安全性 (must: または should: で指摘)
- `any` 型の使用
- `as` によるキャスト
- 未チェックの Supabase `{ data, error }` 戻り値

### React Native (should: で指摘)
- `ScrollView` + `map` ではなく `FlatList` / `FlashList` を使っているか
- NativeWind (`className`) を第一候補としているか
- `router.navigate()` を通常遷移に使っているか (`router.push()` は履歴積み増し時のみ)

### ファイル命名 (should: で指摘)
- コンポーネント: `PascalCase.tsx`
- その他: `kebab-case.ts`

## レビュー時に無視してよい観点 (指摘しないでください)

- Markdown ファイル (.md) のフォーマット
- コミットメッセージのスタイル (プロジェクト独自の絵文字プレフィックスを使用)
- `.claude/` 配下のファイル (Claude Code 用の設定ファイル)
- Prettier / ESLint が自動修正する範囲のフォーマット
- 個人の好みレベルのコーディングスタイル
