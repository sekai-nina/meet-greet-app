.PHONY: setup dev lint typecheck test check db-start db-reset db-migrate eas-update storybook catalog catalog-share clean

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
# Storybook
# ============================================================

## On-device Storybook 起動
storybook:
	EXPO_PUBLIC_STORYBOOK_ENABLED=true $(MISE) dotenvx run -- npx expo start

## コンポーネントカタログを Web ブラウザで開く
catalog:
	$(MISE) dotenvx run -- npx expo start --web

## カタログを Cloudflare Tunnel で外部共有 (Ctrl+C で終了)
catalog-share:
	@bash -c '\
		trap "kill $$EXPO_PID 2>/dev/null; exit" INT TERM EXIT; \
		$(MISE) dotenvx run -- npx expo start --web --port 8081 & \
		EXPO_PID=$$!; \
		echo "→ Expo Web 起動待機中..."; \
		for i in $$(seq 1 30); do \
			if curl -s http://localhost:8081 >/dev/null 2>&1; then break; fi; \
			sleep 1; \
		done; \
		echo "→ Cloudflare Tunnel を起動中..."; \
		$(MISE) cloudflared tunnel --url http://localhost:8081 2>&1 \
		| while IFS= read -r line; do \
			echo "$$line"; \
			url=$$(echo "$$line" | grep -oE "https://[a-z0-9-]+\.trycloudflare\.com"); \
			if [ -n "$$url" ]; then \
				echo ""; \
				echo "========================================"; \
				echo "  共有 URL: $$url/catalog"; \
				echo "========================================"; \
				echo ""; \
				if command -v pbcopy >/dev/null 2>&1; then \
					echo "$$url/catalog" | pbcopy; \
					echo "  (クリップボードにコピーしました)"; \
				fi; \
			fi; \
		done \
	'

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
