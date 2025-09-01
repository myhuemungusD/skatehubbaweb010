// Fullstack TypeScript wrapper - launches both frontend and backend
import { spawn } from 'child_process';
import path from 'path';

console.log('🔄 Starting SkateHubba fullstack application...');

const serverPath = path.join(process.cwd(), 'server', 'index.js');

// Launch the API server on port 3001
const apiServer = spawn('node', [serverPath], {
  stdio: 'pipe',
  env: { ...process.env, NODE_ENV: 'development', PORT: '3001' }
});

// Launch Vite dev server on port 5000 for frontend
const viteServer = spawn('npx', ['vite'], {
  stdio: 'pipe',
  env: { ...process.env },
  cwd: process.cwd()
});

// Handle API server output
apiServer.stdout?.on('data', (data) => {
  process.stdout.write(`[API] ${data}`);
});
apiServer.stderr?.on('data', (data) => {
  process.stderr.write(`[API] ${data}`);
});

// Handle Vite output  
viteServer.stdout?.on('data', (data) => {
  process.stdout.write(`[Frontend] ${data}`);
});
viteServer.stderr?.on('data', (data) => {
  process.stderr.write(`[Frontend] ${data}`);
});

// Handle process exits
apiServer.on('exit', (code) => {
  console.log(`🛑 API server exited with code ${code}`);
  viteServer.kill();
  process.exit(code || 0);
});

viteServer.on('exit', (code) => {
  console.log(`🛑 Frontend server exited with code ${code}`);
  apiServer.kill();
  process.exit(code || 0);
});

// Handle errors
apiServer.on('error', (error) => {
  console.error('❌ Failed to start API server:', error);
  process.exit(1);
});

viteServer.on('error', (error) => {
  console.error('❌ Failed to start Vite server:', error);
  process.exit(1);
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down servers...');
  apiServer.kill('SIGINT');
  viteServer.kill('SIGINT');
});

process.on('SIGTERM', () => {
  console.log('\n🛑 Shutting down servers...');
  apiServer.kill('SIGTERM');
  viteServer.kill('SIGTERM');
});