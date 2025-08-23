#!/usr/bin/env node

import { execSync } from 'child_process';

console.log('🚀 Starting development server without Vite...');

try {
  // Start the server directly with tsx
  console.log('Starting Express server...');
  execSync('NODE_ENV=production npx tsx server/index.ts', { 
    stdio: 'inherit',
    env: { 
      ...process.env, 
      NODE_ENV: 'production' // Skip vite setup
    }
  });
} catch (error) {
  console.error('Failed to start server:', error.message);
  process.exit(1);
}