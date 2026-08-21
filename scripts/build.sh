#!/bin/bash
# Delta Stars - Bulletproof Build Script
# Works in Freebuff, Netlify, Vercel, and local environments

set -e

# Ensure node_modules/.bin is in PATH
export PATH="$PWD/node_modules/.bin:$PATH"

# Find vite binary
if command -v vite &> /dev/null; then
  echo "✅ Found vite via PATH"
  vite build
elif [ -f "./node_modules/.bin/vite" ]; then
  echo "✅ Found vite in node_modules/.bin"
  ./node_modules/.bin/vite build
elif [ -f "./node_modules/vite/bin/vite.js" ]; then
  echo "✅ Found vite via node direct path"
  node ./node_modules/vite/bin/vite.js build
elif command -v npx &> /dev/null; then
  echo "✅ Using npx as fallback"
  npx --yes vite build
else
  echo "❌ vite not found! Installing..."
  npm install vite @vitejs/plugin-react @tailwindcss/vite
  node ./node_modules/vite/bin/vite.js build
fi
