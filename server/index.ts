// Simple TypeScript wrapper for our working Express server
// This allows the existing workflow to continue working while using our clean implementation
import { spawn } from 'child_process';
import path from 'path';

const serverPath = path.join(process.cwd(), 'server', 'index.js');

console.log('🔄 Starting SkateHubba server via TypeScript wrapper...');

const server = spawn('node', [serverPath], {
  stdio: 'inherit',
  env: { ...process.env, NODE_ENV: 'development' }
});

server.on('error', (error) => {
  console.error('❌ Failed to start server:', error);
  process.exit(1);
});

server.on('exit', (code) => {
  console.log(`🛑 Server exited with code ${code}`);
  process.exit(code || 0);
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down server...');
  server.kill('SIGINT');
});

process.on('SIGTERM', () => {
  console.log('\n🛑 Shutting down server...');
  server.kill('SIGTERM');
});