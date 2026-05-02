# Meet & Greet App

## 行動原理

1. **Branch Plan に従って作業する** — `.claude/branch-plan.md` が存在する場合、作業の区切りごとに読み返し、チェックボックスを更新する。フローに記載されたスキルは必ずそのスキルを実行し、自己流で代替しない
2. **3 ステップ以上のタスクは Plan モードで開始する** — いきなりコードを書かず、まず計画を立ててユーザーと合意する
3. **lint・型チェックが通るまで完了としない** — `npx expo lint` と `npx tsc --noEmit` を実行して確認する
4. **UI テキストは日本語** — ユーザー向けの表示はすべて日本語で記述する
5. **Supabase のスキーマ変更は必ずマイグレーションファイルで管理する** — `supabase/migrations/` に SQL を配置し、手動で DB を直接変更しない

## やらないこと

- **ユーザーの許可なくパッケージを追加・削除しない**
- **`app.config.ts` を勝手に変更しない**
- **Supabase ダッシュボードでの手動操作を前提とした説明をしない** — すべてマイグレーションファイルで完結させる
- **`git rebase -i` や `git add -i` など対話的操作を使わない** — Claude Code の Bash は対話モード非対応

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
.claude/                # Claude Code 設定 (rules / agents / skills)
```

## 開発コマンド

```bash
make setup         # 初回セットアップ
make dev           # 開発サーバー起動 (dotenvx 経由)
make lint          # ESLint
make typecheck     # TypeScript 型チェック
make test          # テスト実行
make check         # lint + typecheck + test 一括
make db-start      # ローカル Supabase 起動
make db-reset      # DB リセット + マイグレーション再適用
```

## 環境変数

dotenvx-rs で暗号化管理する。詳細は README.md のセットアップ手順を参照。

```
EXPO_PUBLIC_SUPABASE_URL=
EXPO_PUBLIC_SUPABASE_ANON_KEY=
```

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

