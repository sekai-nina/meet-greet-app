# Create Branch

新しいブランチを作成するワークフロー。

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
git checkout main
git pull origin main
```

### 2. ブランチを作成

```bash
git checkout -b <prefix>/<branch-name>
```

### 3. 確認

```bash
git branch --show-current
```

## 注意事項

- 必ず `main` ブランチから分岐する
- ブランチ名に日本語は使わない
- ブランチ名は変更内容を端的に表す英語にする
- 未コミットの変更がある場合は、先にコミットまたはスタッシュしてからブランチを作成する
