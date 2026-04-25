# Meet & Greet App

## プロジェクト概要

日向坂46 のミート&グリート (ミーグリ) の参加記録と購買計画を管理するスマホアプリ。
自分の記録を残すだけでなく、他ユーザーの記録を集計し、各日程の売れ行き (完売状況) を可視化する。

- ドメイン知識: `docs/domain.md`
- 機能要件・データモデル: `docs/requirements.md`
- ユビキタス言語: `.claude/rules/ubiquitous-language.md`

## 技術スタック

| カテゴリ | 技術 |
|----------|------|
| フレームワーク | React Native + Expo (TypeScript strict) |
| ルーティング | Expo Router (ファイルベース) |
| バックエンド | Supabase (Auth / Postgres / Row Level Security) |
| 状態管理 | Zustand + TanStack Query |
| スタイリング | NativeWind |
| リンター / フォーマッター | ESLint + Prettier |
| DB マイグレーション | `supabase/migrations/` に SQL で管理 |

## ディレクトリ構成

```
app/                    # Expo Router ページ
components/             # 共通コンポーネント
lib/                    # Supabase クライアント、ユーティリティ
hooks/                  # カスタムフック
stores/                 # Zustand ストア
types/                  # TypeScript 型定義
supabase/migrations/    # テーブル定義・RLS ポリシー
docs/                   # ドメイン知識・要件定義
.devcontainer/          # devcontainer 設定 (Dockerfile, docker-compose)
.claude/                # Claude Code 設定 (rules / agents / skills)
```

## 開発コマンド

```bash
make setup       # 初回セットアップ
make dev         # 開発サーバー起動 (dotenvx 経由)
make lint        # ESLint
make typecheck   # TypeScript 型チェック
make test        # テスト実行
make check       # lint + typecheck + test 一括
make db-start    # ローカル Supabase 起動
make db-reset    # DB リセット + マイグレーション再適用
```

## 環境変数

dotenvx-rs で暗号化管理する。詳細は README.md のセットアップ手順を参照。

```
EXPO_PUBLIC_SUPABASE_URL=
EXPO_PUBLIC_SUPABASE_ANON_KEY=
```

## 行動原理

1. **3 ステップ以上のタスクは Plan モードで開始する** — いきなりコードを書かず、まず計画を立ててユーザーと合意する
2. **計画は Codex にレビューしてもらう** — Plan 作成後、`/plan-review` スキルで Codex CLI に設計の曖昧さ・問題点を指摘してもらい、修正してから実装に入る
3. **実装前にドキュメントを更新する** — `/pre-impl-docs` スキルを実行し、ユビキタス言語・ドメイン知識・要件定義を最新化してから実装に入る
3. **実装後にドキュメントの整合性を確認する** — `/post-impl-docs` スキルを実行し、コードとドキュメントの乖離を解消する。特にスキーマ変更後は必須
4. **バックエンドロジックは TDD で実装する** — `lib/`・`hooks/`・`stores/` に変更が入る場合、まず `twada` エージェントを起動し TDD サイクルの遵守を監視させる。テストを先に書く (Red → Green → Refactor)
5. **lint・型チェックが通るまで完了としない** — `npx expo lint` と `npx tsc --noEmit` を実行して確認する
5. **コミット粒度は小さく保つ** — 1 コミット = 1 つの論理的変更。大きな変更は分割する
6. **UI コンポーネントには Storybook ストーリーを追加する** — `components/` に新規コンポーネントを追加したら `/storybook` スキルを実行する
7. **UI テキストは日本語** — ユーザー向けの表示はすべて日本語で記述する
8. **Supabase のスキーマ変更は必ずマイグレーションファイルで管理する** — `supabase/migrations/` に SQL を配置し、手動で DB を直接変更しない

## コミットルール

コミットメッセージには絵文字プレフィックスを必ずつける。詳細は `.claude/skills/commit-changes/SKILL.md` を参照。

| 絵文字 | 用途 |
|--------|------|
| `:dog2:` | 機能追加・改善 |
| `:fish:` | バグ修正 |
| `:balloon:` | リファクタリング・整理 |
| `:soccer:` | テスト追加・修正 |
| `:robot:` | CI/CD・自動化 |
| `:icecream:` | ドキュメント更新 |
| `:bubbles:` | 依存・設定・環境変更 |
| `:art:` | UI デザイン・スタイリング |
| `:ballet_shoes:` | DB スキーマ・マイグレーション |
