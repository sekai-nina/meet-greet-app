# M1: Foundation

## 0. メタ情報

- ステータス: `planned`
- 期間: 2026-04-27 〜 2026-05-11
- オーナー: shinoda
- 関連資料: `docs/requirements.md` (v1 スコープ: F1〜F7)

## 1. 目標（Why）

すべての v1 機能 (F2〜F7) を実装するための基盤を構築する。
DB スキーマ、認証、型定義、ナビゲーション構造が揃った状態をゴールとする。

## 2. スコープ（What）

### 含む（In Scope）

- [ ] v1 に必要な全テーブルのマイグレーション (releases, members, events, event_days, event_day_members, reception_rounds, reception_round_targets, user_oshi_members, participation_records)
- [ ] RLS ポリシー (ユーザー系テーブル)
- [ ] schema_versions テーブル
- [ ] Supabase クライアント初期化 (lib/supabase.ts)
- [ ] DB スキーマから生成した TypeScript 型 + ドメインモデル型
- [ ] 認証フロー (F1: マジックリンク + 匿名サインイン + 匿名→メール連携)
- [ ] Expo Router ナビゲーション構造 (認証済み/未認証ルート分岐)

### 含まない（Out of Scope）

- F2〜F7 の機能実装 (画面・ロジック)
- v2 テーブル (purchase_plans, plan_ideal_slots, plan_actual_slots, plan_round_slots)
- Edge Functions
- プッシュ通知
- UI デザイン・スタイリング (ナビゲーション骨格のみ)

## 3. 完了条件（Definition of Done）

- [ ] `make db-reset` で全マイグレーションが正常適用される
- [ ] RLS ポリシーが適用され、他ユーザーのデータにアクセスできない
- [ ] TypeScript 型がスキーマと一致する
- [ ] マジックリンクログイン・匿名ログインが動作する
- [ ] 未認証ユーザーはログイン画面にリダイレクトされる
- [ ] 認証済みユーザーはタブナビゲーションが表示される
- [ ] `make check` が通る

## 4. 前提・依存関係

- 前提: Supabase プロジェクト (dev) が作成済み
- 前提: dotenvx で `EXPO_PUBLIC_SUPABASE_URL`, `EXPO_PUBLIC_SUPABASE_ANON_KEY` が設定済み
- 外部依存: Supabase Auth (Magic Link 送信にメール設定が必要、ローカルは Inbucket で代替)

## 5. リスクと対策

| リスク | 影響 | 対策 |
|--------|------|------|
| ローカルでのメール送信 | Magic Link テスト困難 | Inbucket (supabase start で自動起動) を使用 |
| 型生成とスキーマの乖離 | 型安全性が崩れる | CI で `supabase gen types` と差分チェックを検討 |

## 6. Issue 一覧

| # | タイトル | スコープ | 依存 |
|---|---------|---------|------|
| 1 | DB スキーマ定義: マスタ系テーブル (releases, members, events) | マスタテーブル 3 つのマイグレーション SQL | なし |
| 2 | DB スキーマ定義: イベント詳細テーブル | event_days, event_day_members, reception_rounds, reception_round_targets | #1 |
| 3 | DB スキーマ定義: ユーザー系テーブル + RLS | user_oshi_members, participation_records, schema_versions + RLS ポリシー | #2 |
| 4 | Supabase クライアントセットアップ | lib/supabase.ts, 型生成, expo-secure-store | #3 |
| 5 | TypeScript 型定義: ドメインモデル型 | types/ ディレクトリ, ドメイン型, Enum 型 | #4 |
| 6 | 認証フロー実装 (F1) | マジックリンク, 匿名サインイン, 匿名→メール連携 | #4 |
| 7 | アプリナビゲーション構造 | Expo Router レイアウト, 認証ガード, タブ骨格 | #6 |

## 7. 曖昧点（未確定事項）

- [ ] メンバーデータの初期投入方法 (seed SQL? 管理画面?)
- [ ] schema_versions の初期値と互換性チェックの実装はどこまでやるか
- [ ] タブナビゲーションの構成 (ホーム / イベント / 記録 / 設定?)

## 8. 決定ログ（Decision Log）

| 日付 | 決定内容 | 理由 |
|------|----------|------|
| 2026-04-26 | v2 テーブルは M1 に含めない | YAGNI。v2 着手時にマイグレーション追加で対応 |
| 2026-04-26 | RLS はユーザー系テーブルのみ M1 で実装 | マスタ系は当面読み取り専用。管理機能ができてから RLS 追加 |
