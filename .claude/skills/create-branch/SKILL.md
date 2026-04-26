# Create Branch

新しいブランチを worktree で作成するワークフロー。Issue 番号を指定すると、Issue の情報を自動で取得して Branch Plan に反映する。

## ブランチ命名規約

ブランチ名はケバブケースで、以下のプレフィックスを使用する:

| プレフィックス | 用途 | 例 |
|--------------|------|-----|
| `feature/` | 新機能の開発 | `feature/event-list-screen` |
| `fix/` | バグ修正 | `fix/auth-redirect-loop` |
| `chore/` | 設定・ドキュメント・リファクタ等 | `chore/update-eslint-config` |

## 手順

### 1. 最新の main を取得

```bash
git fetch origin main
```

### 2. worktree + ブランチを作成

ブランチ名の `/` を `-` に置換したものを worktree ディレクトリ名にする (例: `feature/event-list` → `feature-event-list`)。

```bash
BRANCH="<prefix>/<branch-name>"
WORKTREE_DIR=$(echo "$BRANCH" | tr '/' '-')
git worktree add ".claude/worktrees/$WORKTREE_DIR" -b "$BRANCH" origin/main
```

- worktree は `.claude/worktrees/` 配下に作成される (`.gitignore` で除外済み)
- `.worktreeinclude` に記載されたファイル (`.env` 等) を worktree にコピーする

```bash
while IFS= read -r file; do
  [ -f "$file" ] && cp "$file" ".claude/worktrees/$WORKTREE_DIR/$file"
done < .worktreeinclude
```

### 3. worktree に移動

```bash
cd ".claude/worktrees/$WORKTREE_DIR"
```

以降の作業はこの worktree 内で行う。

### 4. Branch Plan を生成

`.claude/templates/branch-plan-template.md` をコピーして `.claude/branch-plan.md` を作成する。

```bash
cp .claude/templates/branch-plan-template.md .claude/branch-plan.md
```

テンプレート内のプレースホルダーを置換する:
- `{branch-name}` → 作成したブランチ名
- `{date}` → 当日の日付 (YYYY-MM-DD)
- `{issue-number}` → Issue 番号 (指定がなければ空欄)

### 5. Issue 情報の取得 (Issue 番号が指定された場合)

```bash
gh issue view <number> --json title,body
```

取得した情報を Branch Plan に反映する:
- Issue の「目的」セクションの内容を Branch Plan の「目的」に転記する
- Issue の「受け入れ条件」を Branch Plan の「メモ」に転記する

Issue 番号が指定されていない場合は、ユーザーから聞いた内容を「目的」に記入する。

### 6. 確認

```bash
git branch --show-current
pwd
```

Branch Plan の内容をユーザーに共有し、必要に応じて「設計・方針」セクションを一緒に埋める。

## 注意事項

- 必ず `origin/main` から分岐する
- ブランチ名に日本語は使わない
- ブランチ名は変更内容を端的に表す英語にする
- 未コミットの変更がある場合は、先にコミットまたはスタッシュしてからブランチを作成する
- 作業完了後は `/worktree remove` で worktree を削除する
