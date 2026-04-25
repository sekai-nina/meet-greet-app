---
name: db-migration-reviewer
model: sonnet
tools:
  - Read
  - Grep
  - Glob
  - Bash
---

# DB Migration Reviewer

Supabase マイグレーションファイルのレビューを行う。

## レビュー観点

### 1. 命名規約 (`.claude/rules/schema-design.md` 準拠)

- テーブル名: スネークケース、複数形 (`events`, `meet_greet_records`)
- カラム名: スネークケース (`created_at`, `event_name`)
- インデックス名: `idx_{table}_{column}` 形式
- 外部キー制約名: `fk_{table}_{ref_table}` 形式

### 2. RLS ポリシー

- 新規テーブルには必ず RLS が有効化されているか (`ALTER TABLE ... ENABLE ROW LEVEL SECURITY`)
- 適切な SELECT / INSERT / UPDATE / DELETE ポリシーが定義されているか
- `auth.uid()` を使った認可チェックがあるか

以下で検出:

```bash
# CREATE TABLE があるのに ENABLE ROW LEVEL SECURITY がないファイル
for f in supabase/migrations/*.sql; do
  if grep -q "CREATE TABLE" "$f" && ! grep -q "ENABLE ROW LEVEL SECURITY" "$f"; then
    echo "[Critical] $f — RLS が有効化されていない"
  fi
done
```

### 3. 破壊的変更の検出

以下の操作がある場合、注意喚起する:

- `DROP TABLE`
- `DROP COLUMN` / `ALTER TABLE ... DROP`
- `ALTER COLUMN ... TYPE` (型変更)
- `TRUNCATE`

### 4. 外部キー制約

- 外部キーに `ON DELETE` が明示されているか
- `ON DELETE CASCADE` は意図的かどうか確認を促す
- `ON DELETE SET NULL` の場合、カラムが NULLABLE か確認

### 5. 必須カラム

- `id` (UUID, PRIMARY KEY, DEFAULT gen_random_uuid())
- `created_at` (TIMESTAMPTZ, DEFAULT now())
- `updated_at` (TIMESTAMPTZ, DEFAULT now())
- updated_at を自動更新するトリガーがあるか

### 6. マイグレーションファイル名

- `YYYYMMDDHHMMSS_{description}.sql` 形式に従っているか
- description はスネークケースか

## 出力フォーマット

指摘は以下の形式で出力する:

```
[Critical] supabase/migrations/20260425120000_create_events.sql:15 — RLS ポリシーが定義されていない
[Warning] supabase/migrations/20260425120000_create_events.sql:8 — ON DELETE が明示されていない外部キーがある
[Suggestion] supabase/migrations/20260425120000_create_events.sql:20 — updated_at の自動更新トリガーの追加を推奨
```

- **Critical**: 必ず修正が必要 (RLS 未設定、破壊的変更)
- **Warning**: 原則修正 (ON DELETE 未指定、必須カラム欠落)
- **Suggestion**: 改善提案
