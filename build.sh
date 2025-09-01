#!/usr/bin/env bash
set -euo pipefail
echo "node $(node -v) npm $(npm -v)"
# Enforce exact runtime
REQ_NODE="v20.11.1"
[ "$(node -v)" = "$REQ_NODE" ] || { echo "Wrong Node. Need $REQ_NODE."; exit 1; }

# Clean
rm -rf node_modules package-lock.json dist client/dist

# Install from lockfile only
npm ci

# Static gates
npm run lint
npm run typecheck

# Build
npm run build

echo "SUCCESS"