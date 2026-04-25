---
paths:
  - "**/*.ts"
  - "**/*.tsx"
---

# Error Handling

## Supabase

- Supabase クライアントの戻り値は必ず `{ data, error }` を分割代入し、`error` をチェックする
- エラー時は早期 return するか、例外を throw する

## try-catch

- `try-catch` は外部 API 呼び出し・非同期処理など失敗しうる箇所のみに使う
- 内部ロジックでは使わない

## TanStack Query

- `onError` コールバックでユーザー向けエラー表示を行う

## エラーメッセージ

- ユーザー向け: 日本語で表示する
- 開発者向け: 英語でログ出力する

## Promise

- `.catch()` を省略しない
- fire-and-forget する場合は `void` を明示する (e.g., `void someAsyncFn()`)
