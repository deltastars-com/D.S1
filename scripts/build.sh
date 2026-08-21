#!/bin/bash
# Delta Stars - Bulletproof Build Script v2
# Always uses node direct path - works in ANY environment

set -e

VITE_BIN="./node_modules/vite/bin/vite.js"

if [ -f "$VITE_BIN" ]; then
  echo "✅ Running vite via node"
  node "$VITE_BIN" build
elif [ -f "./node_modules/.bin/vite" ]; then
  echo "✅ Running vite via bin link"
  ./node_modules/.bin/vite build
elif command -v npx &> /dev/null; then
  echo "✅ Running via npx fallback"
  npx --yes vite build
else
  echo "❌ No vite found! Try: npm install"
  exit 1
fi
