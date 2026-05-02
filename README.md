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
| リンター / フォーマッター | ESLint + Prettier |
| 環境変数管理 | dotenvx-rs |
| ツール管理 | mise |
| DB マイグレーション | Supabase CLI (`supabase/migrations/`) |
| 機密情報スキャン | Gitleaks (pre-commit) + GitHub Push Protection |

## セキュリティ

- **pre-commit**: Gitleaks が機密情報パターンをコミット前にブロック (`make setup` で自動設定)
- **push 時**: GitHub Push Protection がリモートで二重チェック (public リポジトリで自動有効)
- **環境変数**: dotenvx-rs で暗号化。平文の `.env` / `.env.keys` はコミット禁止 (`.gitignore` で除外済み)

## 開発フロー

このプロジェクトは **Claude Code** を使った AI アシスト開発を前提としています。
開発は **計画フェーズ** と **実装フェーズ** の 2 段階で進めます。

### Phase 1: 計画 (マイルストーン → Issue)

```
docs/milestones/M1-xxx.md    マイルストーン定義 (目標・スコープ・DoD)
        ↓
曖昧点レビュー                ambiguity-review で質問を潰す
        ↓
GitHub Issues に分解          1 Issue = 1 ブランチで完結する粒度
```

- マイルストーンは `docs/milestones/` で管理する。テンプレート: `docs/milestones/milestone-template.md`
- Issue は受け入れ条件を明確にしてから着手する。テンプレート: `docs/milestones/issue-template.md`
- 詳細は [`docs/milestones/README.md`](docs/milestones/README.md) を参照

### Phase 2: 実装 (Issue → ブランチ → PR)

```
/create-branch               Issue からブランチ作成 + branch-plan.md 生成
        ↓
branch-plan.md に従って作業   設計 → ドキュメント → 実装 → レビュー
        ↓
/create-pr                   PR 作成 → Copilot レビュー → マージ
```

ブランチ作成時に `.claude/branch-plan.md` が自動生成され、フローのチェックリストとして機能します。
Claude Code は作業の区切りごとにこのファイルを読み返し、記載されたスキルを実行します。
テンプレート: `.claude/templates/branch-plan-template.md`

### Claude Code 設定ファイル

| ファイル | 役割 |
|----------|------|
| `CLAUDE.md` | プロジェクト概要・技術スタック・行動原理 |
| `.claude/rules/` | コーディング規約・命名規則・ユビキタス言語 |
| `.claude/templates/` | Branch Plan テンプレート |
| `.claude/agents/` | レビューエージェント・TDD 監視エージェント |
| `.claude/skills/` | ワークフロースキル (下表参照) |
| `.claude/hooks/` | 自動リマインド・設計レビュー |

### スキル一覧

| コマンド | 説明 |
|---------|------|
| `/create-branch` | ブランチ作成 + branch-plan.md 生成 |
| `/plan-review` | Plan モードの設計案を Codex CLI でレビュー |
| `/pre-impl-docs` | ユビキタス言語・要件定義を実装前に最新化 |
| `/commit` | lint → 型チェック → 絵文字プレフィックス付きコミット |
| `/review` | 4 つのレビューエージェントを並列起動 |
| `/post-impl-docs` | 実装後にドキュメントとコードの整合性を確認 |
| `/create-pr` | PR 作成 (Copilot レビュー付き) |
| `/respond-to-pr-review` | レビューコメントを分類・対応 |
| `/worktree` | git worktree の管理 |

## ドキュメント

| ドキュメント | 内容 |
|-------------|------|
| [`docs/domain.md`](docs/domain.md) | ミーグリのドメイン知識 (構造・用語・購入の仕組み) |
| [`docs/requirements.md`](docs/requirements.md) | 機能要件・非機能要件・データモデル・画面構成 |
| [`docs/milestones/`](docs/milestones/) | マイルストーン定義・Issue テンプレート |
| [`.claude/rules/ubiquitous-language.md`](.claude/rules/ubiquitous-language.md) | ユビキタス言語 (日本語⇔コード上の英語名の対応表) |
