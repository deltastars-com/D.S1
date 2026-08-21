#!/bin/sh
# Delta Stars — Production Web Build Script
# Works in any environment by resolving node_modules/.bin relative to project root

set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

VITE_BIN="$PROJECT_ROOT/node_modules/.bin/vite"
ESBUILD_BIN="$PROJECT_ROOT/node_modules/.bin/esbuild"

# Fallback: if binaries aren't in node_modules, try npx
if [ ! -f "$VITE_BIN" ]; then
  echo "[build] vite not found in node_modules, using npx..."
  VITE_BIN="npx --yes vite"
else
  VITE_BIN="node $VITE_BIN"
fi

if [ ! -f "$ESBUILD_BIN" ]; then
  echo "[build] esbuild not found in node_modules, using npx..."
  ESBUILD_BIN="npx --yes esbuild"
else
  ESBUILD_BIN="node $ESBUILD_BIN"
fi

echo "[build] Running vite build..."
$VITE_BIN build

echo "[build] Running esbuild server bundle..."
$ESBUILD_BIN server/_core/index.ts \
  --bundle \
  --platform=node \
  --format=esm \
  --packages=external \
  --sourcemap \
  --outfile=dist/index.js

echo "[build] ✅ Build complete!"
