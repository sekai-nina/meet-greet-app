---
paths:
  - "**/*.ts"
  - "**/*.tsx"
---

# Naming Conventions

## コンポーネント・フック・ストア

- コンポーネント: `PascalCase` (e.g., `EventDayList`)
- カスタムフック: `use` プレフィックス (e.g., `useEventDays`)
- Zustand ストア: `use{Name}Store` (e.g., `useAuthStore`)

## 型

- 型 / インターフェース: `PascalCase`。`I` プレフィックスは付けない
- 列挙的な型は union type で定義する (enum は使わない)

## ファイル名

- コンポーネント: `PascalCase.tsx` (e.g., `EventCard.tsx`)
- それ以外 (フック・ストア・ユーティリティ含む): `kebab-case.ts` (e.g., `use-event-days.ts`, `auth-store.ts`, `supabase-client.ts`)
- Expo Router のページファイルはルーティング規約に従う (e.g., `[id].tsx`, `_layout.tsx`)

**注意**: ファイル名とエクスポート名は異なるルール。ファイル名は `kebab-case`、エクスポート名は `camelCase` / `PascalCase`。
- ファイル: `use-event-days.ts` → エクスポート: `useEventDays`
- ファイル: `auth-store.ts` → エクスポート: `useAuthStore`

## Boolean

- Boolean 変数 / props: `is`, `has`, `should`, `can` プレフィックス

## イベントハンドラ

- コンポーネント内部: `handle` プレフィックス (e.g., `handlePress`)
- Props として渡す場合: `on` プレフィックス (e.g., `onPress`)
