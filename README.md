# Meet & Greet App

日向坂46 のミート&グリート (ミーグリ) の参加記録と購買計画を管理するスマホアプリ。

## 必要なツール

| ツール | 用途 | 備考 |
|--------|------|------|
| Docker Desktop | devcontainer + Supabase ローカル環境 | 必須 |
| VS Code + Dev Containers 拡張 | devcontainer での開発 | 推奨 |
| Expo Go (iOS / Android) | 実機での動作確認 | スマホにインストール |
| Codex CLI | 設計レビュー (Plan モード時) | ホスト側にインストール: `npm install -g @openai/codex` |
| Claude Code | AI 開発アシスタント | ホスト側にインストール: [公式](https://docs.anthropic.com/en/docs/claude-code) |

> Node.js, dotenvx-rs, Supabase CLI 等はすべて devcontainer 内に含まれているため、個別インストール不要です。

## セットアップ

### 方法 A: devcontainer (推奨)

```bash
git clone <repository-url>
cd meet-greet-app
```

VS Code でフォルダを開き、「Reopen in Container」を選択。コンテナ起動後に `make setup` が自動実行されます。

### 方法 B: ローカル (devcontainer を使わない場合)

<details>
<summary>手動セットアップ手順</summary>

以下のツールを個別にインストールしてください:

| ツール | バージョン | インストール |
|--------|-----------|-------------|
| Node.js | 24+ | [公式](https://nodejs.org/) or asdf/mise |
| dotenvx-rs | 最新 | `brew install linux-china/tap/dotenvx-rs` |
| Supabase CLI | 最新 | `brew install supabase/tap/supabase` |

```bash
git clone <repository-url>
cd meet-greet-app
make setup
```

</details>

### 環境変数の設定

環境変数は **[dotenvx-rs](https://github.com/linux-china/dotenvx-rs)** で暗号化管理しています。平文の `.env` をコミットすることは禁止です。

**新規開発者**: 既存メンバーから復号鍵 (`DOTENV_PRIVATE_KEY`) を受け取り、`dotenvx decrypt` を実行してください。

**プロジェクト新規作成時**:
```bash
dotenvx init           # .env 作成 (鍵は $HOME/.dotenvx/.env.keys.json に保存)
# .env を編集して Supabase 接続情報を記入
dotenvx encrypt        # 暗号化
```

### 動作確認用スマートフォン

| プラットフォーム | 要件 |
|-----------------|------|
| iOS | iOS 15+ の実機 + Expo Go |
| Android | Android 12+ の実機 + Expo Go |

## 開発コマンド

すべて `make` で実行できます。

```bash
make setup       # 初回セットアップ (npm install + 環境確認)
make dev         # 開発サーバー起動 (dotenvx 経由)
make lint        # ESLint
make typecheck   # TypeScript 型チェック
make test        # テスト実行
make check       # lint + typecheck + test 一括
make db-start    # ローカル Supabase 起動
make db-reset    # DB リセット + マイグレーション再適用
make db-migrate NAME=xxx  # 新しいマイグレーション作成
make clean       # node_modules 等を削除
```

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
.claude/                # Claude Code 設定 (rules / agents / skills)
```

## 技術スタック

| カテゴリ | 技術 |
|----------|------|
| フレームワーク | React Native + Expo (TypeScript strict) |
| ルーティング | Expo Router (ファイルベース) |
| バックエンド | Supabase (Auth / Postgres / Row Level Security) |
| 状態管理 | Zustand + TanStack Query |
| スタイリング | NativeWind |
| コンポーネントカタログ | Storybook (React Native) |
| リンター / フォーマッター | ESLint + Prettier |
| 環境変数管理 | dotenvx |
| DB マイグレーション | Supabase CLI (`supabase/migrations/`) |

## Claude Code による開発

このプロジェクトは **Claude Code** を使った AI アシスト開発を前提としています。

### 設定ファイル

| ファイル | 役割 |
|----------|------|
| `CLAUDE.md` | プロジェクト概要・技術スタック・行動原理 |
| `.claude/rules/` | コーディング規約・命名規則・ユビキタス言語 |
| `.claude/agents/reviewer/` | レビューエージェント (アーキテクチャ / コード品質 / DB マイグレーション) |
| `.claude/skills/` | ワークフロースキル (下表参照) |
| `.claude/settings.json` | エージェント実行許可 |

### スキル一覧

| スキル | コマンド | 説明 |
|--------|---------|------|
| 設計レビュー | `/plan-review` | Plan モードの設計案を Codex CLI でレビュー |
| 実装前ドキュメント更新 | `/pre-impl-docs` | ユビキタス言語・要件定義を実装前に最新化 |
| 実装後ドキュメント更新 | `/post-impl-docs` | 実装後にドキュメントとコードの整合性を確認 |
| Storybook | `/storybook` | コンポーネントのストーリーを作成・更新 |
| コミット | `/commit` | lint→型チェック→絵文字プレフィックス付きコミット |
| ブランチ作成 | `/create-branch` | 命名規約に従ったブランチ作成 |
| PR 作成 | `/create-pr` | レビュー実施→PR 作成 |
| コードレビュー | `/review` | 3つのレビューエージェントを並列起動 |
| Worktree 管理 | `/worktree` | git worktree の作成・一覧・切替・削除 |

### 典型的な開発フロー

```
1. /worktree create feature/xxx     ← worktree を作成
2. Plan モードで設計                 ← 3ステップ以上のタスク
3. /plan-review                     ← Codex で設計レビュー
4. /pre-impl-docs                   ← ドキュメント更新
5. 実装                             ← コードを書く
6. /storybook                       ← UI コンポーネントのストーリー追加
7. /post-impl-docs                  ← ドキュメント整合性チェック
8. /commit                          ← lint→型チェック→コミット
9. /review                          ← コードレビュー
10. /create-pr                      ← PR 作成
```

## ドキュメント

| ドキュメント | 内容 |
|-------------|------|
| [`docs/domain.md`](docs/domain.md) | ミーグリのドメイン知識 (構造・用語・購入の仕組み) |
| [`docs/requirements.md`](docs/requirements.md) | 機能要件・非機能要件・データモデル・画面構成 |
| [`.claude/rules/ubiquitous-language.md`](.claude/rules/ubiquitous-language.md) | ユビキタス言語 (日本語⇔コード上の英語名の対応表) |
