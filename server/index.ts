// Fullstack TypeScript wrapper - launches both frontend and backend
import { spawn } from 'child_process';
import path from 'path';

const serverPath = path.join(process.cwd(), 'server', 'index.js');

const API_PORT = process.env.API_PORT || '3001';
const FRONTEND_PORT = process.env.PORT || '5000';

console.log('🔄 Starting SkateHubba fullstack application...');
console.log(`📡 API Server: http://localhost:${API_PORT}`);
console.log(`🌐 Frontend: http://localhost:${FRONTEND_PORT}`);

// Start API server with tsx to handle TypeScript
const apiServer = spawn('npx', ['tsx', serverPath], {
  stdio: 'pipe',
  env: { ...process.env, NODE_ENV: 'development', PORT: API_PORT }
});

// Start Vite dev server with custom config to fix host blocking
const viteServer = spawn('npx', ['vite', '--config', 'vite.config.override.js'], {
  stdio: 'pipe',
  env: { ...process.env },
  cwd: process.cwd()
});

// Output handling with clear labels
apiServer.stdout?.on('data', (data) => {
  process.stdout.write(`[API] ${data}`);
});
apiServer.stderr?.on('data', (data) => {
  process.stderr.write(`[API] ${data}`);
});

viteServer.stdout?.on('data', (data) => {
  process.stdout.write(`[Frontend] ${data}`);
});
viteServer.stderr?.on('data', (data) => {
  process.stderr.write(`[Frontend] ${data}`);
});

// Handle process exits
apiServer.on('exit', (code) => {
  console.log(`\n🛑 API server exited with code ${code}`);
  viteServer.kill();
  process.exit(code || 0);
});

viteServer.on('exit', (code) => {
  console.log(`\n🛑 Frontend server exited with code ${code}`);
  apiServer.kill();
  process.exit(code || 0);
});

// Handle startup errors
apiServer.on('error', (error) => {
  console.error('❌ Failed to start API server:', error);
  viteServer.kill();
  process.exit(1);
});

viteServer.on('error', (error) => {
  console.error('❌ Failed to start Vite server:', error);
  apiServer.kill();
  process.exit(1);
});

// Graceful shutdown handlers
process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down fullstack application...');
  apiServer.kill('SIGINT');
  viteServer.kill('SIGINT');
});

process.on('SIGTERM', () => {
  console.log('\n🛑 Shutting down fullstack application...');
  apiServer.kill('SIGTERM');
  viteServer.kill('SIGTERM');
});