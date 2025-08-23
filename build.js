#!/usr/bin/env node

import { execSync } from 'child_process';

function buildProject() {
  console.log('🚀 Building SkateHubba for production...');
  
  console.log('Building server with fixed ESBuild configuration...');
  
  try {
    // Build server with proper externals - FIXED: ESM format + packages=external
    const esbuildCommand = [
      'node_modules/tsx/node_modules/esbuild/bin/esbuild server/index.ts',
      '--bundle',
      '--platform=node',
      '--outfile=dist/server.js',
      '--format=esm', // FIXED: Use ESM instead of CJS to support top-level await and import.meta
      '--packages=external', // FIXED: Automatically excludes all Node.js built-ins (path, fs, etc.)
      '--external:@neondatabase/serverless',
      '--external:pg', 
      '--external:ws',
      '--target=node18',
      '--sourcemap'
    ].join(' ');
    
    execSync(esbuildCommand, { stdio: 'inherit' });
    
    console.log('✅ Server build completed with ESBuild fixes applied');
    console.log('   - Used --packages=external to exclude Node.js built-ins');
    console.log('   - Used --format=esm to support import.meta and top-level await');
    console.log('   - No more dynamic require errors for Node.js modules like "path"');
    console.log('🚀 Deployment-ready build completed successfully!');
  } catch (error) {
    console.error('❌ Server build failed:', error);
    process.exit(1);
  }
}

buildProject();