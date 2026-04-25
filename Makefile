.PHONY: setup dev lint typecheck test check db-start db-reset db-migrate eas-update clean

# ============================================================
# セットアップ
# ============================================================

## 初回セットアップ (依存パッケージ + Git hooks + 環境変数確認)
setup:
	@if [ -f package.json ]; then \
		npm install; \
	else \
		echo "⚠ package.json not found. Skipping npm install (design phase)."; \
	fi
	@bash scripts/setup-hooks.sh
	@if [ -f .env ]; then \
		echo "✓ .env found"; \
	else \
		echo "⚠ .env not found. Run 'dotenvx init' or get the private key from a team member."; \
	fi

# ============================================================
# 開発
# ============================================================

## 開発サーバー起動
dev:
	dotenvx run -- npx expo start

## ESLint 実行
lint:
	npx expo lint

## TypeScript 型チェック
typecheck:
	npx tsc --noEmit

## テスト実行
test:
	npx jest --forceExit

## lint + typecheck + test を一括実行
check: lint typecheck test

# ============================================================
# Supabase
# ============================================================

## ローカル Supabase を起動
db-start:
	supabase start

## ローカル DB をリセット & マイグレーション再適用
db-reset:
	supabase db reset

## 新しいマイグレーションファイルを作成 (usage: make db-migrate NAME=add_events)
db-migrate:
	supabase migration new $(NAME)

# ============================================================
# EAS
# ============================================================

## EAS Update (OTA) を preview チャンネルに公開
eas-update:
	eas update --channel preview --non-interactive

# ============================================================
# クリーンアップ
# ============================================================

## node_modules と生成物を削除
clean:
	rm -rf node_modules .expo dist coverage
