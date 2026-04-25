FROM node:24-bookworm-slim

RUN apt-get update && apt-get install -y --no-install-recommends \
    git \
    curl \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/*

# dotenvx-rs (Rust 版 / アーキテクチャ自動判定)
RUN ARCH=$(uname -m) && \
    case "$ARCH" in \
      aarch64|arm64) TARGET="aarch64-unknown-linux-gnu" ;; \
      x86_64)        TARGET="x86_64-unknown-linux-gnu" ;; \
      *)             echo "Unsupported architecture: $ARCH" && exit 1 ;; \
    esac && \
    curl -fsSL "https://github.com/linux-china/dotenvx-rs/releases/latest/download/dotenvx-${TARGET}.tar.gz" \
    | tar -xz -C /usr/local/bin/

# Supabase CLI
RUN curl -fsSL https://raw.githubusercontent.com/supabase/cli/main/install.sh | sh

# EAS CLI
RUN npm install -g eas-cli

WORKDIR /workspace
