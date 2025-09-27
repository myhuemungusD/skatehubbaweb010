// Fullstack TypeScript wrapper - launches both frontend and backend
import { spawn } from 'child_process';
import path from 'path';

const serverPath = path.join(process.cwd(), 'server', 'index.js');

console.log('🔄 Starting SkateHubba fullstack application...');
console.log('📡 API Server: http://localhost:3001');
console.log('🌐 Frontend: http://localhost:5173');

// Start API server on port 3001
const apiServer = spawn('node', [serverPath], {
  stdio: 'pipe',
  env: { ...process.env, NODE_ENV: 'development', PORT: '3001' }
});

// Start Vite dev server on port 5173 for frontend (default Vite port)
const viteServer = spawn('npx', ['vite', '--host', '0.0.0.0', '--port', '5173'], {
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