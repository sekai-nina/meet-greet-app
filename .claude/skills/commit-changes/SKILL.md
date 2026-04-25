# Commit Changes

変更をコミットするワークフロー。

## 手順

### 1. チェック

```bash
make check
```

- lint + 型チェック + テストを一括実行する
- エラーがあれば修正する
- 実装変更がない場合 (ドキュメントのみ、設定ファイルのみ等) はスキップ可

### 3. 変更内容の確認

```bash
git status
git diff --staged
git diff
```

- 変更内容をユーザーに提示する
- コミットに含めるファイルを確認する
- ユーザーの許可を得てからコミットする

### 4. コミットメッセージの作成

コミットメッセージには必ず以下の絵文字プレフィックスをつける:

| 絵文字 | コード | 用途 | 例 |
|--------|--------|------|-----|
| :dog2: | `:dog2:` | 機能追加・改善 | 新しい画面、コンポーネント、フック追加 |
| :fish: | `:fish:` | バグ修正 | ロジック修正、表示崩れ修正 |
| :balloon: | `:balloon:` | リファクタリング・整理 | コード整理、ファイル移動、命名変更 |
| :soccer: | `:soccer:` | テスト追加・修正 | ユニットテスト、TDD の Red/Green |
| :robot: | `:robot:` | CI/CD・自動化 | GitHub Actions、EAS 設定、hooks |
| :icecream: | `:icecream:` | ドキュメント更新 | domain.md、requirements.md、README |
| :bubbles: | `:bubbles:` | 依存・設定・環境変更 | package.json、dotenvx、devcontainer |
| :art: | `:art:` | UI デザイン・スタイリング | Storybook、NativeWind テーマ、アイコン |
| :ballet_shoes: | `:ballet_shoes:` | DB スキーマ・マイグレーション | テーブル追加、RLS ポリシー、SQL |

**使い分けのポイント:**
- テストと CI は分ける — `:soccer:` はテストコード、`:robot:` は CI ワークフロー
- TDD の Red (失敗するテスト追加) も `:soccer:`
- ユビキタス言語の更新は `:icecream:`
- Storybook ストーリーの追加・更新は `:art:`
- NativeWind のテーマ変更やアイコン差し替えも `:art:`
- NativeWind の初期設定やESLint 設定の変更は `:bubbles:`

**メッセージ構成:**

```
:emoji: タイトル (何を変更したか)

Why: なぜこの変更が必要か (1-2文)

Co-Authored-By: ...
```

- タイトルは **何を (What)** したかを簡潔に
- **Why** は必須。この変更がなぜ必要かを書く。「何を変えたか」はコードを見ればわかるが、「なぜ変えたか」はコミットメッセージでしか伝わらない
- メッセージは日本語で記述する

### 5. コミット実行

```bash
git add <files>
git commit -m "$(cat <<'EOF'
:emoji: タイトル

Why: この変更が必要な理由

Co-Authored-By: Claude Opus 4.6 (1M context) <noreply@anthropic.com>
EOF
)"
```

- `Why:` 行を必ず含める
- `Co-Authored-By` を必ず付与する
- `.env` やシークレットファイルをコミットしない
- 変更がない場合は空コミットを作成しない

## コミット分割の原則

**1 コミット = 1 つの絵文字プレフィックスがぴったりはまる単位** にする。

- 1 コミットに複数の絵文字が必要になる場合は、分割が足りないサイン
- 特に以下は個別コミットにする:
  - **スキル**: 1 スキル = 1 コミット (例: `commit-changes/SKILL.md` と `review/SKILL.md` は別コミット)
  - **エージェント**: 1 エージェント = 1 コミット (例: `twada.md` と `code-quality.md` は別コミット)
  - **ルール**: 関連するルール群は 1 コミットにまとめてよい (例: `typescript/` 配下をまとめる)
  - **ワークフロー**: 1 ワークフロー = 1 コミット (例: `ci.yml` と `eas-update.yml` は別コミット)
  - **ドキュメント**: 1 ドキュメント = 1 コミット (例: `domain.md` と `requirements.md` は別コミット)
- 設定ファイルの追加 (`.prettierrc`, `tsconfig.json` 等) は関連するものをまとめてよい

### 分割の例

```
# 良い例: 1 コミットの役割が明確
:robot: twada エージェント追加
:robot: code-quality-reviewer エージェント追加
:robot: review スキル追加
:robot: CI ワークフロー追加 (ci.yml)
:robot: EAS Update ワークフロー追加 (eas-update.yml)
:icecream: ドメイン知識を整理 (domain.md)
:icecream: 要件定義を整理 (requirements.md)
:bubbles: Expo プロジェクト初期化 (package.json, tsconfig, eslint, prettier)
:dog2: Hello World 画面追加

# 悪い例: 1 コミットに複数の役割
:robot: エージェントとスキルを全部追加  ← 分割すべき
:bubbles: 設定ファイルとドキュメント追加  ← 絵文字が混在
```

## 注意事項

- `git add -A` や `git add .` は使わない。ファイルを個別に指定する
- pre-commit hook が失敗した場合は `--amend` せず、新しいコミットを作成する
- ユーザーの明示的な許可なくコミットしない
