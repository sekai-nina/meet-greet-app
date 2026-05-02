# Branch Plan

## ブランチ
- ブランチ名: chore/create-design-docs
- 作成日: 2026-04-29
- Issue: #

## 目的
アプリの設計書を作成する。

## 設計・方針
<!-- Plan モードで合意した内容を転記。途中で変わったらここを更新する -->
<!-- 例: 使用するコンポーネント、データフロー、テーブル設計など -->

---

## フロー

### 1. 設計
- [ ] Plan モードで設計を行い、ユーザーと合意した
- [ ] `/plan-review` で Codex にレビューしてもらい、指摘を反映した
- [ ] 上の「設計・方針」セクションに合意内容を転記した

### 2. ドキュメント更新（実装前）
- [ ] `/pre-impl-docs` を実行し、以下を最新化した
  - ユビキタス言語 (`.claude/rules/ubiquitous-language.md`)
  - ドメイン知識 (`docs/domain.md`)
  - 要件定義 (`docs/requirements.md`)
- [ ] `/commit` でドキュメント変更をコミットした（実装とは分離）

### 3. 実装
- [ ] backend ロジック (`lib/` `hooks/` `stores/`) はテストを先に書いた
- [ ] UI コンポーネントを追加・変更した場合、同じタイミングで `/storybook` を実行した (ストーリー + カタログ両方)
- [ ] `/commit` で実装をコミットした（1 コミット = 1 論理的変更）

### 4. セルフレビュー
- [ ] `/review` を実行し、Critical 指摘がゼロになるまで修正した
- [ ] `make check` が通る（lint + typecheck + test）

### 5. ドキュメント更新（実装後）
- [ ] `/post-impl-docs` を実行し、コードとドキュメントの乖離を解消した
- [ ] `/commit` でドキュメント変更をコミットした

### 6. PR 作成・レビュー対応
- [ ] `/create-pr` で PR を作成した（Copilot レビュー付き）
- [ ] `/respond-to-pr-review` で Copilot のレビューコメントに対応した
- [ ] must / should の指摘をすべて解消した
- [ ] すべての conversation が resolved になった
- [ ] ユーザーの最終確認を得た
- [ ] fixup + autosquash で修正コミットを統合した
- [ ] `--force-with-lease` で push した
- [ ] CI が通ることを確認した
- [ ] マージした

---

## メモ
<!-- 途中で変わった方針、ハマったこと、次回への申し送りなど -->
