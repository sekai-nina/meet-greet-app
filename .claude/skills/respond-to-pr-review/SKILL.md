---
name: respond-to-pr-review
description: PR のレビューコメント (GitHub Copilot 等) を重要度で分類し、対応・議論・スキップを判断して処理するスキル
---

# PR レビュー対応スキル

PR についたレビューコメント (GitHub Copilot、人間レビュアー) を読み、重要度で分類・対応する。

## 実行タイミング

- PR にレビューコメントがついた後
- ユーザーから「レビュー対応して」と言われたとき

## 手順

### 1. レビューコメントの取得

```bash
# PR 番号を特定
gh pr list --state open --head $(git branch --show-current) --json number -q '.[0].number'

# レビューコメントを取得
gh api repos/{owner}/{repo}/pulls/{pr_number}/comments --paginate
gh api repos/{owner}/{repo}/pulls/{pr_number}/reviews --paginate
```

### 2. コメントの重要度分類

各コメントを以下の 4 段階に分類する。
人間のレビュアーがプレフィックスをつけている場合はそれに従う。
Copilot 等のプレフィックスなしコメントは内容から判断して分類する。

#### must: (修正必須)
マージ前に必ず修正が必要。レビュアーを納得させるまでマージ不可。
- セキュリティリスク (秘密情報の露出、RLS の欠如)
- バグの可能性が高いコード
- 型安全性の明確な問題 (`any` 型、未チェックの error)
- データ損失リスク

#### should: (原則修正)
原則修正する。修正しない場合はレビュアーに根拠を示して合意を得る。マージ前に resolve が必要。
- 設計上の問題 (依存方向の逆転、責務の肥大化)
- 命名規約やインポート規約の違反
- パフォーマンス上の懸念
- `.claude/rules/` に定義された規約への違反

#### may: (任意)
対応は任意。resolve しなくてもマージ可。
- 代替案の提案 (現状でも問題ない)
- 主観的なスタイル指摘
- 「こちらの方がベター」レベルの改善案
- `.claude/` 配下のファイルへの指摘

#### question: (質問)
設計意図や実装理由への質問。回答してレビュアーの理解を助ける。resolve が必要。
- 「なぜこの方法を選んだのか?」
- 「この動作は意図通りか?」
- 仕様の確認

### 3. 分類結果をユーザーに提示

```
## レビュー対応計画

### must: — N 件 (マージ前に修正必須)
1. [file:line] 指摘内容 → 修正方針
2. ...

### should: — N 件 (原則修正、合意あればスキップ可)
1. [file:line] 指摘内容 → 修正方針 or 反論の根拠
2. ...

### may: — N 件 (任意、マージ可)
1. [file:line] 指摘内容 → 対応するかの判断
2. ...

### question: — N 件 (回答が必要)
1. [file:line] 質問内容 → 回答案
2. ...
```

ユーザーの承認を得てから次のステップに進む。

### 4. 修正の実施

must / should に分類したコメントに対して修正を行う。

- 観点ごとにコミットを分割する
- コミットメッセージに対応するレビューコメントの内容を含める
- push してからレビューに返信する (コミットハッシュがリンクになるため)

### 5. レビューへの返信

各コメントに返信する。**重要度プレフィックスを返信にも含める。**

```bash
# must: / should: で修正した場合
gh api repos/{owner}/{repo}/pulls/{pr_number}/comments \
  --method POST \
  --field body="修正しました。{コミットハッシュ} で対応しています。" \
  --field in_reply_to={comment_id} \
  --field commit_id="$(git rev-parse HEAD)" \
  --field path="{file}" \
  --field line={line} \
  --field side=RIGHT

# should: で修正しない場合 (根拠を示す)
gh api repos/{owner}/{repo}/pulls/{pr_number}/comments \
  --method POST \
  --field body="should: の指摘ですが、以下の理由で現状を維持します。

{根拠の説明}

ご意見があればお聞かせください。" \
  --field in_reply_to={comment_id} \
  --field commit_id="$(git rev-parse HEAD)" \
  --field path="{file}" \
  --field line={line} \
  --field side=RIGHT

# question: への回答
gh api repos/{owner}/{repo}/pulls/{pr_number}/comments \
  --method POST \
  --field body="{回答}" \
  --field in_reply_to={comment_id} \
  --field commit_id="$(git rev-parse HEAD)" \
  --field path="{file}" \
  --field line={line} \
  --field side=RIGHT

# may: — 対応する場合は修正+返信、しない場合は返信不要
```

### 6. 再レビューの確認

修正を push した後:
1. CI が通ることを確認
2. Copilot が再レビューする場合は 60 秒待って新しいコメントを確認
3. 新しい指摘があれば手順 2 から繰り返す

### 7. マージ判定

以下の **すべて** を満たした場合にマージ可能:

- [ ] CI がパスしている
- [ ] **must:** の指摘がすべて修正済み
- [ ] **should:** の指摘がすべて修正済み、または根拠を示してレビュアーと合意済み
- [ ] **question:** にすべて回答済み
- [ ] すべての conversation が resolved になっている

**may:** の未対応はマージをブロックしない。

### 8. マージ前の fixup

**レビュー指摘の修正コミットは、マージ前に元のコミットに fixup する。**

レビュー対応で生まれた修正コミットは履歴ノイズになるため、元のコミットに統合してからマージする。

修正コミット作成時に `fixup!` プレフィックスをつけておき、`--autosquash` で自動整理する。

```bash
# 1. 修正コミット時に fixup! プレフィックスをつける
git commit -m "fixup! :bubbles: Makefile を mise ベースに更新"

# 2. PR のベースブランチとの分岐点を特定
BASE=$(git merge-base main HEAD)

# 3. autosquash で fixup! コミットを自動的に元コミットに統合 (非対話モード)
GIT_SEQUENCE_EDITOR=true git rebase -i --autosquash $BASE

# 4. force push (PR ブランチのみ。main には絶対にしない)
git push --force-with-lease
```

**注意:**
- 対話的な rebase 編集はしない (`GIT_SEQUENCE_EDITOR=true` で自動実行する)
- fixup は **PR ブランチ内のコミットのみ** が対象。main にマージ済みのコミットには絶対に行わない
- `--force-with-lease` を使い、他の人の push を上書きしないようにする
- fixup 後に CI が再度パスすることを確認してからマージする

### 9. マージ実行

```bash
gh pr merge {pr_number} --merge --delete-branch
```

## 重箱の隅への対処

Copilot が重箱の隅をつつくような指摘ばかりする場合:
- `.github/copilot-instructions.md` の「レビュー時に無視してよい観点」に追加する
- 繰り返される不要な指摘パターンを記録し、次回以降の分類精度を上げる
- may: に分類して返信せずスルーする

## 注意事項

- レビュアーの指摘は尊重する。must/should は必ず対応する
- should の反論は建設的に。根拠を示して議論する
- 人間のレビュアーと Copilot で対応の丁寧さを変えない
- ユーザーの明示的な承認なく修正をコミットしない
- conversation の resolve を忘れない
