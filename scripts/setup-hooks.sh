#!/bin/bash
# Git hooks のセットアップスクリプト
# 新規開発者は make setup 時に自動実行される

set -euo pipefail

HOOKS_DIR="$(git rev-parse --show-toplevel)/.git/hooks"

# pre-commit: Gitleaks による機密情報スキャン
cat > "$HOOKS_DIR/pre-commit" << 'HOOK'
#!/bin/bash
# Gitleaks pre-commit hook: コミット前に機密情報をスキャン

if ! command -v gitleaks &>/dev/null; then
  echo "⚠ gitleaks がインストールされていません。brew install gitleaks で導入してください。"
  exit 0
fi

gitleaks protect --staged --verbose
if [ $? -ne 0 ]; then
  echo ""
  echo "❌ 機密情報が検出されました。コミットを中止します。"
  echo "   誤検知の場合は .gitleaksignore に追加してください。"
  exit 1
fi
HOOK

chmod +x "$HOOKS_DIR/pre-commit"
echo "✓ pre-commit hook (gitleaks) を設定しました"
