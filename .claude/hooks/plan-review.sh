#!/bin/bash
# Plan Mode 終了後に Codex CLI で設計レビューを自動実行する
#
# 環境変数:
#   CLAUDE_PROJECT_DIR - プロジェクトルート (Claude Code が自動設定)

set -euo pipefail

PROJECT_DIR="${CLAUDE_PROJECT_DIR:-$(cd "$(dirname "$0")/../.." && pwd)}"
PLAN_DIR="$HOME/.claude/plans"
RESULT_FILE="/tmp/plan-review-result-$(date +%s).md"

# codex が利用可能か確認
if ! command -v codex &>/dev/null; then
  echo "⚠ codex CLI が見つかりません。plan-review をスキップします。" >&2
  exit 0
fi

# 最新のプランファイルを探す
LATEST_PLAN=$(ls -t "$PLAN_DIR"/*.md 2>/dev/null | head -1)

if [ -z "$LATEST_PLAN" ]; then
  echo "⚠ プランファイルが見つかりません。plan-review をスキップします。" >&2
  exit 0
fi

PLAN_CONTENT=$(cat "$LATEST_PLAN")

REVIEW_PROMPT="あなたはシニアソフトウェアアーキテクトです。
以下の設計案をレビューし、次の観点で指摘してください。

## レビュー観点
1. **曖昧な点**: 設計として決まっていない・詰めが甘い箇所を質問形式で指摘
2. **設計上の問題**: パフォーマンス、スケーラビリティ、保守性の観点で問題がないか
3. **代替案**: より良いアプローチがあれば提案 (理由付き)
4. **見落とし**: 考慮されていないエッジケースやセキュリティリスク

## プロジェクト概要
- 日向坂46 ミーグリ管理アプリ (React Native + Expo + Supabase)
- React Native + Expo (TypeScript strict), Expo Router, Supabase (Auth/Postgres/RLS), Zustand + TanStack Query, NativeWind, dotenvx-rs, EAS Update (OTA)

## 出力フォーマット
- [質問] — 曖昧な点への質問
- [問題] — 設計上の問題点
- [提案] — 代替案や改善案
- [見落とし] — 考慮漏れ

最後に総合評価を一言で。

## レビュー対象の設計案
${PLAN_CONTENT}"

codex exec --full-auto -C "$PROJECT_DIR" -o "$RESULT_FILE" "$REVIEW_PROMPT" 2>/dev/null

if [ -f "$RESULT_FILE" ] && [ -s "$RESULT_FILE" ]; then
  echo ""
  echo "━━━ Codex 設計レビュー結果 ━━━"
  cat "$RESULT_FILE"
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  echo ""
  echo "レビュー結果: $RESULT_FILE"
fi
