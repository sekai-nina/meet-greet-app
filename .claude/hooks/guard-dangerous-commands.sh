#!/bin/bash
# Bash ツール実行前に危険なコマンドを検出してブロックする
#
# PreToolUse hook は stdin から JSON を受け取る

set -eo pipefail

INPUT=$(cat)

# jq が無い場合は fail-closed (安全側に倒してブロック)
if ! command -v jq &>/dev/null; then
  cat <<WARN
{
  "decision": "block",
  "reason": "jq が見つかりません。危険コマンドガードが機能しないためブロックします。brew install jq または apt install jq でインストールしてください。"
}
WARN
  exit 0
fi

COMMAND=$(echo "$INPUT" | jq -r '.tool_input.command // empty' 2>/dev/null || echo "")

if [ -z "$COMMAND" ]; then
  exit 0
fi

# コマンドの引数部分 (コミットメッセージや PR body) に含まれるキーワードの誤検知を防ぐ
# heredoc 内容 (<<EOF...EOF, <<'EOF'...EOF) と -m/--body 引数を除去する
COMMAND_STRIPPED=$(echo "$COMMAND" | sed \
  -e "/<<['\"]\\{0,1\\}EOF/,/^EOF/d" \
  -e "/<<['\"]\\{0,1\\}WARN/,/^WARN/d" \
  -e "s/git commit -m .*//g" \
  -e "s/--body .*//g" \
  -e "s/--body=.*//g" \
  -e 's/--field body=".*"//g' \
  -e "s/--field body='.*'//g" \
  -e "s/--field body=.*//g")

# 危険なコマンドパターン (大文字小文字区別なし)
if echo "$COMMAND_STRIPPED" | grep -qiE \
  "rm -rf /|rm -rf \.|git push --force($| )|git push -f[ \t]|git push -f$|git reset --hard|git checkout \.$|git clean -f|DROP TABLE|DROP DATABASE|TRUNCATE|git branch -D main|git branch -D master"; then
  cat <<WARN
{
  "decision": "block",
  "reason": "危険なコマンドを検出しました。このコマンドを実行するにはユーザーの明示的な許可が必要です。"
}
WARN
  exit 0
fi

exit 0
