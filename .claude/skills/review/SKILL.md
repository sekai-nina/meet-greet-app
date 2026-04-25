# Review

変更ファイルに対してコードレビューを実施するワークフロー。

## 手順

### 1. 変更ファイルの収集

まず HEAD が存在するか確認する:

```bash
git rev-parse HEAD >/dev/null 2>&1
```

**HEAD が存在する場合** (通常):
```bash
# ステージ済み + 未ステージの変更ファイル
git diff --name-only HEAD
# 未追跡ファイル
git ls-files --others --exclude-standard
```

変更ファイルがない場合は、最新コミットの変更ファイルを対象とする:
```bash
git diff --name-only HEAD~1
```

**HEAD が存在しない場合** (初期コミット前):
```bash
# 全ファイルを対象とする
git ls-files --others --exclude-standard
```

### 2. ファイル種別に応じたレビューエージェントの起動

変更ファイルを種別ごとに分類し、該当するレビューエージェントを起動する:

| ファイルパターン | レビューエージェント |
|----------------|-------------------|
| `**/*.ts`, `**/*.tsx` | `code-quality-reviewer` |
| `app/**`, `components/**`, `hooks/**`, `stores/**`, `lib/**` | `architecture-reviewer` |
| `lib/**`, `hooks/**`, `stores/**` | `twada` (TDD 遵守チェック) |
| `supabase/migrations/**/*.sql` | `db-migration-reviewer` |

- 1つのファイルが複数のレビューエージェントの対象になる場合がある (例: `app/event/[id].tsx` は `code-quality-reviewer` と `architecture-reviewer` の両方)
- 各レビューエージェントは並列に起動する

### 3. レビュー結果の集約

各レビューエージェントの結果をセクション別に集約して出力する:

```
## Architecture Review
[Critical] ...
[Warning] ...

## Code Quality Review
[Warning] ...
[Suggestion] ...

## TDD Review (twada)
[TDD違反] ...
判定: PASS / WARN / FAIL

## DB Migration Review
(該当ファイルなし)
```

### 4. サマリーの表示

最後に指摘件数のサマリーを表示する:

```
## Summary
| レベル | 件数 |
|--------|------|
| Critical | 2 |
| Warning | 5 |
| Suggestion | 3 |
| **合計** | **10** |
```

## 注意事項

- 変更のないファイルはレビュー対象外
- 削除されたファイルはレビュー対象外
- `.md` ファイル、設定ファイル (`.json`, `.yml` 等) は基本的にレビュー対象外
- レビュー結果に基づく修正は自動では行わない。ユーザーに提示して判断を委ねる
