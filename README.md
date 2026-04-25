# Meet & Greet App

日向坂46 のミート&グリート (ミーグリ) の参加記録と購買計画を管理するスマホアプリ。

## 必要なツール

| ツール | 用途 | インストール |
|--------|------|-------------|
| **mise** | Node.js・CLI ツールのバージョン管理 | [インストール手順](#mise-の初期設定) |
| **Xcode** | iOS シミュレータ (任意) | App Store |
| **Claude Code** | AI 開発アシスタント | [公式](https://docs.anthropic.com/en/docs/claude-code) |
| **Expo Go** | 実機での動作確認 | スマホの App Store / Google Play |

> mise をインストールすれば、Node.js・Gitleaks・Supabase CLI・EAS CLI・Codex CLI は `mise install` で自動的にインストールされます。dotenvx-rs は `make setup` で自動インストールされます。

### mise の初期設定

```bash
# mise をインストール
curl https://mise.run | sh

# シェルに mise を有効化 (zsh の場合)
echo 'eval "$($HOME/.local/bin/mise activate zsh)"' >> ~/.zshrc
source ~/.zshrc
```

## セットアップ

```bash
git clone git@github.com:sekai-nina/meet-greet-app.git
cd meet-greet-app
mise install        # Node.js, gitleaks, supabase, eas-cli, codex をインストール
make setup          # npm install + dotenvx-rs + Git hooks 設定
```

### 環境変数の設定

環境変数は **[dotenvx-rs](https://github.com/linux-china/dotenvx-rs)** で暗号化管理しています。平文の `.env` をコミットすることは禁止です。

**新規開発者**: 既存メンバーから復号鍵 (`DOTENV_PRIVATE_KEY`) を受け取り、`dotenvx decrypt` を実行してください。

**プロジェクト新規作成時**:
```bash
dotenvx init           # .env 作成 (鍵は $HOME/.dotenvx/.env.keys.json に保存)
# .env を編集して Supabase 接続情報を記入
dotenvx encrypt        # 暗号化
```

### 動作確認

| 方法 | コマンド | 備考 |
|------|---------|------|
| 実機 (Expo Go) | `make dev` → QR コードをスキャン | Xcode 不要 |
| iOS シミュレータ | `npx expo start -i` | Xcode 必須 |

## 開発コマンド

すべて `make` で実行できます。

```bash
make setup       # 初回セットアップ (mise ツール確認 + dotenvx-rs + npm install + hooks)
make dev         # 開発サーバー起動 (dotenvx 経由)
make lint        # ESLint
make typecheck   # TypeScript 型チェック
make test        # テスト実行
make check       # lint + typecheck + test 一括
make db-start    # ローカル Supabase 起動 (Docker 必要)
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
| 環境変数管理 | dotenvx-rs |
| ツール管理 | mise |
| DB マイグレーション | Supabase CLI (`supabase/migrations/`) |
| 機密情報スキャン | Gitleaks (pre-commit) + GitHub Push Protection |

## セキュリティ

- **pre-commit**: Gitleaks が機密情報パターンをコミット前にブロック (`make setup` で自動設定)
- **push 時**: GitHub Push Protection がリモートで二重チェック (public リポジトリで自動有効)
- **環境変数**: dotenvx-rs で暗号化。平文の `.env` / `.env.keys` はコミット禁止 (`.gitignore` で除外済み)

## Claude Code による開発

このプロジェクトは **Claude Code** を使った AI アシスト開発を前提としています。

### 設定ファイル

| ファイル | 役割 |
|----------|------|
| `CLAUDE.md` | プロジェクト概要・技術スタック・行動原理 |
| `.claude/rules/` | コーディング規約・命名規則・ユビキタス言語 |
| `.claude/agents/reviewer/` | レビューエージェント (アーキテクチャ / コード品質 / DB マイグレーション) |
| `.claude/agents/twada.md` | TDD 遵守監視エージェント |
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
| コードレビュー | `/review` | 4つのレビューエージェントを並列起動 |
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
