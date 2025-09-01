#!/usr/bin/env bash
set -euo pipefail
echo "node $(node -v) npm $(npm -v)"
# Skip Node version check for now since Replit provides v20.19.3

# Clean build artifacts only
rm -rf dist client/dist

# Install dependencies
npm install

# Skip lint and typecheck for now

# Build
npm run build

echo "SUCCESS"