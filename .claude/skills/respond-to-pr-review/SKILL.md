---
name: respond-to-pr-review
description: PR のレビューコメント (GitHub Copilot 等) を分類し、対応・議論・無視を判断して処理するスキル
---

# PR レビュー対応スキル

PR についたレビューコメント (GitHub Copilot、人間レビュアー) を読み、分類・対応する。

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

### 2. コメントの分類

各コメントを以下の 3 カテゴリに分類する:

#### 対応する (Fix)
- セキュリティリスク、バグの可能性
- 設計上の明確な問題
- 命名やインポートの実質的な誤り
- `.claude/rules/` に定義された規約違反の指摘

#### 議論する (Discuss)
- 設計判断に対する代替案の提案
- トレードオフが存在する指摘
- プロジェクトの方針に関わる意見

#### 無視する (Skip)
- フォーマットの好み (Prettier が管理する範囲)
- 主観的なスタイル指摘 (「こちらの方が好み」レベル)
- 既に `.claude/rules/` で別の方針を採用している事項
- 同じ指摘の重複

### 3. 分類結果をユーザーに提示

```
## レビュー対応計画

### Fix (修正する) — N 件
1. [file:line] 指摘内容 → 修正方針
2. ...

### Discuss (議論する) — N 件
1. [file:line] 指摘内容 → Claude の見解 + 返信案
2. ...

### Skip (無視する) — N 件
1. 指摘内容 → スキップ理由
```

ユーザーの承認を得てから次のステップに進む。

### 4. 修正の実施

Fix に分類したコメントに対して修正を行う。

- 観点ごとにコミットを分割する
- コミットメッセージに対応するレビューコメントの内容を含める
- push してからレビューに返信する (コミットハッシュがリンクになるため)

### 5. レビューへの返信

各コメントに返信する。バッククォート対策として一時ファイル経由で送信する。

```bash
# Fix の場合
BODY_FILE=$(mktemp)
cat > "$BODY_FILE" << 'MSG'
修正しました。{コミットハッシュ} で対応しています。
MSG
gh api repos/{owner}/{repo}/pulls/{pr_number}/comments/{comment_id}/replies \
  --method POST \
  --field body="$(cat "$BODY_FILE")"
rm "$BODY_FILE"

# Discuss の場合
BODY_FILE=$(mktemp)
cat > "$BODY_FILE" << 'MSG'
ご指摘ありがとうございます。

{Claude の見解・根拠}

{質問があれば質問}
MSG
gh api repos/{owner}/{repo}/pulls/{pr_number}/comments/{comment_id}/replies \
  --method POST \
  --field body="$(cat "$BODY_FILE")"
rm "$BODY_FILE"

# Skip の場合 — 返信しない (ノイズになるため)
```

### 6. 再レビューの確認

修正を push した後:
1. CI が通ることを確認
2. Copilot が再レビューする場合は新しいコメントを待つ
3. 全コメントが resolved になるまで繰り返す

### 7. マージ前の fixup

**レビュー指摘の修正コミットは、マージ前に元のコミットに fixup する。**

レビュー対応で生まれた修正コミットは履歴ノイズになるため、元のコミットに統合してからマージする。

```bash
# 1. PR のベースブランチとの分岐点を特定
BASE=$(git merge-base main HEAD)

# 2. 対話的 rebase で fixup (autosquash で fixup! コミットを自動整理)
git rebase -i $BASE

# 3. rebase 中に修正コミットを対応する元コミットの直後に移動し、pick → fixup に変更
# 例:
#   pick abc1234 :bubbles: Makefile を mise ベースに更新
#   fixup def5678 :fish: Makefile の dotenvx-rs インストールを cross-platform 対応

# 4. force push (PR ブランチのみ。main には絶対にしない)
git push --force-with-lease
```

**注意:**
- fixup は **PR ブランチ内のコミットのみ** が対象。main にマージ済みのコミットには絶対に行わない
- `--force-with-lease` を使い、他の人の push を上書きしないようにする
- fixup 後に CI が再度パスすることを確認してからマージする

## 注意事項

- レビュアーの指摘は尊重する。「無視」は指摘が間違っているのではなく、このプロジェクトの方針と合わないという判断
- Discuss の返信は建設的に。根拠を示して議論する
- 人間のレビュアーとCopilot で対応の丁寧さを変えない
- ユーザーの明示的な承認なく修正をコミットしない
