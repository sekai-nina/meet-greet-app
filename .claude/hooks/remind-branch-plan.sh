#!/bin/bash
# Edit/Write 後に branch-plan.md の確認をリマインドする
# 毎回ではなく 5 回に 1 回だけ発火し、ノイズを抑える

PLAN_FILE="${CLAUDE_PROJECT_DIR:-.}/.claude/branch-plan.md"
PROJECT_DIR="${CLAUDE_PROJECT_DIR:-.}"
if command -v md5 &>/dev/null; then
  PROJECT_HASH=$(echo "$PROJECT_DIR" | md5 -q)
elif command -v md5sum &>/dev/null; then
  PROJECT_HASH=$(echo "$PROJECT_DIR" | md5sum | cut -d' ' -f1)
elif command -v shasum &>/dev/null; then
  PROJECT_HASH=$(echo "$PROJECT_DIR" | shasum | cut -d' ' -f1)
else
  PROJECT_HASH="default"
fi
COUNTER_FILE="/tmp/branch-plan-remind-counter-${PROJECT_HASH}"

# branch-plan.md が存在しなければ何もしない
if [ ! -f "$PLAN_FILE" ]; then
  exit 0
fi

# カウンターをインクリメント (ファイルがなければ 0 から)
COUNT=$(cat "$COUNTER_FILE" 2>/dev/null || echo 0)
COUNT=$((COUNT + 1))
echo "$COUNT" > "$COUNTER_FILE"

# 5 回に 1 回だけリマインド
if [ $((COUNT % 5)) -ne 0 ]; then
  exit 0
fi

cat "$PLAN_FILE"
