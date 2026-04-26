#!/bin/bash
# Edit/Write 後に branch-plan.md の確認をリマインドする
# 毎回ではなく 5 回に 1 回だけ発火し、ノイズを抑える

PLAN_FILE="${CLAUDE_PROJECT_DIR:-.}/.claude/branch-plan.md"
COUNTER_FILE="/tmp/branch-plan-remind-counter"

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
