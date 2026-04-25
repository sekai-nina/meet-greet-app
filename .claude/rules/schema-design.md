---
paths:
  - supabase/migrations/**/*.sql
---

# Supabase / Postgres Schema Design Rules

## テーブル設計

- テーブル名は複数形 snake_case (e.g., `releases`, `event_days`)
- PK は `{単数形}_id` (e.g., `release_id`)、UUID 型、デフォルト `gen_random_uuid()`
- タイムスタンプは `timestamptz` 型。カラム名は `created_at`, `updated_at`
- 全テーブルに `created_at` / `updated_at` を必須で定義する
- DEFAULT 句はタイムスタンプと UUID 以外では原則禁止

## 命名規約

- インデックス: `idx_{テーブル名}_{カラム名}`
- ユニーク制約: `uq_{テーブル名}_{カラム名}`
- 外部キー: `fk_{テーブル名}_{参照テーブル名}`

## 外部キー

- 外部キーには `ON DELETE` 動作を必ず明示する (CASCADE / SET NULL / RESTRICT)

## RLS

- RLS ポリシーはマイグレーションファイル内で定義する
- `ALTER TABLE ... ENABLE ROW LEVEL SECURITY;` を忘れない

## マイグレーション

- ファイル名: `YYYYMMDDHHMMSS_{description}.sql`
