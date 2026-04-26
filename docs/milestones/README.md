# Milestones

このフォルダでは、マイルストーン定義とその具体化（曖昧点の解消、Issue化）を管理します。

## 目的

- マイルストーンごとのスコープと完了条件を明確にする
- 実装前に曖昧点を質問で潰す
- 合意済み内容を GitHub Issue に分解する

## 推奨フロー

1. `milestone-template.md` でマイルストーン草案を作る
2. `ambiguity-review-template.md` で曖昧点を質問化する
3. 質問への回答をマイルストーンに反映する
4. `issue-template.md` で Issue を起票する

## ステータス定義

- `planned`: 未着手（定義中）
- `in_progress`: 実行中
- `blocked`: ブロッカーあり
- `done`: 完了（DoD 達成）

## ファイル命名

- マイルストーン: `M{番号}-{短い英語名}.md`  
  例: `M1-foundation.md`, `M2-mvp.md`
- 曖昧点レビュー: `M{番号}-ambiguity-review.md`
- Issue 起票メモ（任意）: `M{番号}-issues.md`

