#!/bin/bash
set -e

echo "🔄 Building SkateHubba for production..."

# Install dependencies
echo "📦 Installing dependencies..."
npm ci

# Build both client and server
echo "🏗️ Building application..."
npm run build

echo "✅ Build completed successfully!"
echo "📂 Client assets: dist/public/"
echo "📂 Server bundle: dist/server/"
echo "🚀 Ready to start with: NODE_ENV=production node dist/server/index.js"