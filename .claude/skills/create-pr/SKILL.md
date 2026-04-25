# Create PR

Pull Request を作成するワークフロー。

## 手順

### 1. 未コミットの変更を確認

```bash
git status
```

- 未コミットの変更がある場合は、先に `/commit` でコミットする

### 2. コードレビューの実施

`/review` スキルを実行して、変更内容のレビューを行う。

- **Critical** の指摘は必ず修正してからPRを作成する
- **Warning** の指摘は原則修正する
- **Suggestion** は対応任意だが、簡単に対応できるものは修正する

### 3. リモートへのプッシュ

```bash
git push -u origin $(git branch --show-current)
```

### 4. PR の作成

PR タイトル:
- 日本語で記述
- 70文字以内
- 変更内容を端的に表す

PR 本文テンプレート:

```bash
gh pr create --title "PRタイトル" --body "$(cat <<'EOF'
## 概要
(変更の目的を1-3行で記述)

## 変更内容
- 変更点1
- 変更点2
- 変更点3

## テスト計画
- [ ] テスト方法1
- [ ] テスト方法2

🤖 Generated with [Claude Code](https://claude.com/claude-code)
EOF
)"
```

### 5. PR URL の共有

作成した PR の URL をユーザーに共有する。

## 注意事項

- `main` ブランチから直接 PR を作成しない
- PR 作成前に必ずレビューを実施する
- Critical な指摘が残っている状態で PR を作成しない
