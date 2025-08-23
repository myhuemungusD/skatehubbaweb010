#!/usr/bin/env node

import { execSync } from 'child_process';

function buildProject() {
  console.log('Building client...');
  
  try {
    // Build client first
    execSync('npx vite build --outDir dist/public', { stdio: 'inherit' });
    console.log('✅ Client build completed');
  } catch (error) {
    console.error('❌ Client build failed:', error.message);
    process.exit(1);
  }

  console.log('Building server...');
  
  try {
    // Build server with proper externals using npx
    const esbuildCommand = [
      'npx esbuild server/index.ts',
      '--bundle',
      '--platform=node',
      '--outfile=dist/server.js',
      '--format=cjs',
      '--packages=external', // This automatically excludes all Node.js built-ins
      '--external:@neondatabase/serverless',
      '--external:pg',
      '--external:ws',
      '--target=node18',
      '--sourcemap'
    ].join(' ');
    
    execSync(esbuildCommand, { stdio: 'inherit' });
    
    console.log('✅ Server build completed');
    console.log('🚀 Build process finished successfully!');
  } catch (error) {
    console.error('❌ Server build failed:', error);
    process.exit(1);
  }
}

buildProject();