#!/bin/bash
# Git hooks のセットアップスクリプト
# 新規開発者は make setup 時に自動実行される

set -euo pipefail

HOOKS_DIR="$(git rev-parse --git-path hooks)"
mkdir -p "$HOOKS_DIR"

# pre-commit: Gitleaks による機密情報スキャン
cat > "$HOOKS_DIR/pre-commit" << 'HOOK'
#!/bin/bash
# Gitleaks pre-commit hook: コミット前に機密情報をスキャン

if command -v mise &>/dev/null; then
  # グローバル設定の Python 等を無視し、プロジェクトのツールだけを対象にする
  GITLEAKS_CMD="env MISE_GLOBAL_CONFIG_FILE=/dev/null MISE_DEFAULT_TOOL_VERSIONS_FILENAME=/dev/null mise exec -- gitleaks"
elif command -v gitleaks &>/dev/null; then
  GITLEAKS_CMD="gitleaks"
else
  echo "❌ gitleaks を実行できないため、コミットを中止します。"
  echo "   mise を使用して gitleaks を導入してください:"
  echo "     mise install gitleaks"
  echo "   シェルに mise activate を設定していない場合は mise exec 経由で実行されます。"
  exit 1
fi

$GITLEAKS_CMD protect --staged --verbose
if [ $? -ne 0 ]; then
  echo ""
  echo "❌ 機密情報が検出されました。コミットを中止します。"
  echo "   誤検知の場合は .gitleaksignore に追加してください。"
  exit 1
fi
HOOK

chmod +x "$HOOKS_DIR/pre-commit"
echo "✓ pre-commit hook (gitleaks) を設定しました"
