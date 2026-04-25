---
name: worktree
description: git worktree の作成・一覧・切替・削除を管理するスキル
---

# Worktree 管理スキル

機能実装やバグ修正を並列で進めるために、git worktree のライフサイクルを管理する。

## コマンド

ユーザーの指示に応じて以下を実行する。

### 作成: `/worktree create <name>`

新しい worktree を作成して作業を開始する。

1. ブランチ命名規約 (`.claude/skills/create-branch/SKILL.md`) に従い、ブランチ名を決定する
   - `<name>` がそのままブランチ名になる (例: `feature/add-event-list`)
2. `main` の最新を取得する
   ```bash
   git fetch origin main
   ```
3. worktree を作成する
   ```bash
   git worktree add .claude/worktrees/<name> -b <branch-name> origin/main
   ```
4. `.worktreeinclude` に記載されたファイルを worktree にコピーする
5. 作成完了を報告し、worktree のパスを提示する

### 一覧: `/worktree list`

現在の worktree を一覧表示する。

```bash
git worktree list
```

各 worktree について以下を表示する:
- パス
- ブランチ名
- 最新コミットの要約

### 切替: `/worktree switch <name>`

指定した worktree に作業ディレクトリを切り替える。

1. 現在の worktree に未コミットの変更がないか確認する
   - 変更がある場合はユーザーに警告し、コミットまたはスタッシュを提案する
2. 指定した worktree のパスに移動する

### 削除: `/worktree remove <name>`

worktree を削除する。

1. 対象 worktree に未コミットの変更がないか確認する
   - 変更がある場合はユーザーに確認を取る
2. ブランチが main にマージ済みか確認する
   - 未マージの場合は警告する
3. worktree を削除する
   ```bash
   git worktree remove .claude/worktrees/<name>
   ```
4. ブランチが不要であればユーザーに削除を提案する
   ```bash
   git branch -d <branch-name>
   ```

### 掃除: `/worktree prune`

不要になった worktree をまとめて整理する。

1. `git worktree list` で全 worktree を確認する
2. 各 worktree のブランチが main にマージ済みか判定する
3. マージ済みの worktree を一覧表示し、ユーザーに一括削除の確認を取る
4. 承認されたものを削除する
   ```bash
   git worktree remove .claude/worktrees/<name>
   git branch -d <branch-name>
   ```
5. `git worktree prune` で参照切れを掃除する

## 注意事項

- worktree は `.claude/worktrees/` 配下に作成する (`.gitignore` で除外済み)
- 削除は必ずユーザーの確認を取ってから実行する
- 未マージのブランチを `git branch -D` (強制削除) する場合は明示的に警告する
