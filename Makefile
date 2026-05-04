.PHONY: setup dev lint typecheck test check db-start db-reset db-migrate db-seed-user db-seed-dummy eas-update clean

# mise exec 経由でコマンドを実行し、mise activate なしでも pinned ツールを使えるようにする
# グローバル設定 (~/.tool-versions, ~/.config/mise/config.toml) を無視し、
# プロジェクトの .mise.toml のツールだけを対象にする
export MISE_GLOBAL_CONFIG_FILE := /dev/null
export MISE_DEFAULT_TOOL_VERSIONS_FILENAME := /dev/null
MISE := mise exec --

# ============================================================
# セットアップ
# ============================================================

## 初回セットアップ (mise ツール確認 + dotenvx-rs + npm install + Git hooks)
setup:
	@command -v mise >/dev/null || (echo "❌ mise がインストールされていません。https://mise.run を参照してください" && exit 1)
	@echo "→ mise install (Node.js, gitleaks, supabase, eas-cli, codex)..."
	@mise install node gitleaks supabase npm:eas-cli npm:@openai/codex
	@echo "→ dotenvx-rs の確認..."
	@export PATH="$$HOME/.local/bin:$$PATH" && \
	command -v dotenvx >/dev/null || ( \
		echo "→ dotenvx-rs をインストール中..." && \
		mkdir -p $$HOME/.local/bin && \
		OS=$$(uname -s | tr '[:upper:]' '[:lower:]') && \
		ARCH=$$(uname -m) && \
		case "$${OS}-$${ARCH}" in \
			darwin-arm64)   TARGET="aarch64-apple-darwin" ;; \
			darwin-x86_64)  TARGET="x86_64-apple-darwin" ;; \
			linux-aarch64)  TARGET="aarch64-unknown-linux-gnu" ;; \
			linux-x86_64)   TARGET="x86_64-unknown-linux-gnu" ;; \
			*)              echo "❌ Unsupported platform: $${OS}-$${ARCH}" && exit 1 ;; \
		esac && \
		curl -fsSL "https://github.com/linux-china/dotenvx-rs/releases/latest/download/dotenvx-$${TARGET}.tar.gz" \
		| tar -xz -C $$HOME/.local/bin/ && \
		echo "✓ dotenvx-rs をインストールしました ($$HOME/.local/bin/dotenvx)" \
	)
	@echo "→ npm install..."
	@$(MISE) npm install
	@echo "→ Git hooks の設定..."
	@bash scripts/setup-hooks.sh
	@if [ -f .env ]; then \
		echo "✓ .env found"; \
	else \
		echo "⚠ .env not found. Run 'dotenvx init' or get the private key from a team member."; \
	fi
	@echo "✓ セットアップ完了"

# ============================================================
# 開発
# ============================================================

## 開発サーバー起動
dev:
	$(MISE) dotenvx run -- npx expo start

## ESLint 実行
lint:
	$(MISE) npx expo lint

## TypeScript 型チェック
typecheck:
	$(MISE) npx tsc --noEmit

## テスト実行
test:
	$(MISE) npx jest --forceExit

## lint + typecheck + test を一括実行
check: lint typecheck test

# ============================================================
# Supabase
# ============================================================

## ローカル Supabase を起動
db-start:
	$(MISE) supabase start

## ローカル DB をリセット & マイグレーション再適用
db-reset:
	$(MISE) supabase db reset

## 新しいマイグレーションファイルを作成 (usage: make db-migrate NAME=add_events)
db-migrate:
	$(MISE) supabase migration new $(NAME)

EMAIL ?= dev@example.com
SUPABASE_URL := http://127.0.0.1:54321

## 開発ユーザーを作成しサンプルデータを投入
db-seed-user:
	@echo "→ Creating user $(EMAIL) via Auth Admin API..."
	@SECRET_KEY=$$($(MISE) supabase status -o env 2>/dev/null | grep '^SERVICE_ROLE_KEY=' | sed 's/^SERVICE_ROLE_KEY="//;s/"$$//') && \
	RESULT=$$(curl -s -X POST "$(SUPABASE_URL)/auth/v1/admin/users" \
		-H "Authorization: Bearer $$SECRET_KEY" \
		-H "Content-Type: application/json" \
		-d "{\"email\":\"$(EMAIL)\",\"email_confirm\":true,\"password\":\"password123\"}") && \
	echo "$$RESULT" | head -c 200 && echo ""
	@echo "→ Seeding sample data..."
	@$(MISE) supabase db query -f supabase/seed-user-data.sql
	@echo "✅ Done! Login with $(EMAIL) (OTP via http://localhost:54324)"

## ダミーユーザーを作成しサンプル申込データを投入
db-seed-dummy:
	@echo "→ Creating dummy users via Auth Admin API..."
	@SECRET_KEY=$$($(MISE) supabase status -o env 2>/dev/null | grep '^SERVICE_ROLE_KEY=' | sed 's/^SERVICE_ROLE_KEY="//;s/"$$//') && \
	curl -s -X POST "$(SUPABASE_URL)/auth/v1/admin/users" \
		-H "Authorization: Bearer $$SECRET_KEY" \
		-H "Content-Type: application/json" \
		-d '{"email":"dummy-a@example.com","email_confirm":true,"password":"password123"}' | head -c 100 && echo "" && \
	curl -s -X POST "$(SUPABASE_URL)/auth/v1/admin/users" \
		-H "Authorization: Bearer $$SECRET_KEY" \
		-H "Content-Type: application/json" \
		-d '{"email":"dummy-b@example.com","email_confirm":true,"password":"password123"}' | head -c 100 && echo ""
	@echo "→ Seeding dummy user data..."
	@$(MISE) supabase db query -f supabase/seed-dummy-users.sql
	@echo "✅ Done! 2 dummy users created with sample application data."

# ============================================================
# EAS
# ============================================================

## EAS Update (OTA) を preview チャンネルに公開
eas-update:
	$(MISE) eas update --channel preview --non-interactive

# ============================================================
# クリーンアップ
# ============================================================

## node_modules と生成物を削除
clean:
	rm -rf node_modules .expo dist coverage
