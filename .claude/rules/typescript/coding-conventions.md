---
paths:
  - "**/*.ts"
  - "**/*.tsx"
---

# TypeScript Coding Conventions

## import

- import 文は3グループに分ける (間に空行):
  1. React / React Native / Expo
  2. 外部ライブラリ
  3. プロジェクト内モジュール
- 型の import は `import type { ... }` を使う
- 未使用の変数・import は残さない

## 型安全性

- `any` 型は原則禁止。やむを得ない場合は `// eslint-disable-next-line` + 理由コメント
- `as` によるキャストは原則禁止。型ガードまたはスキーマバリデーションを使う

## 命名

- 定数: `UPPER_SNAKE_CASE`
- 変数・関数: `camelCase`
- 型・コンポーネント: `PascalCase`

## コーディングスタイル

- マジックナンバー禁止。名前付き定数に切り出す
- `console.log` はデバッグ用。コミット前に削除する
- Optional chaining (`?.`) と Nullish coalescing (`??`) を積極的に使う
- 三項演算子のネストは禁止。早期 return または変数に分ける
