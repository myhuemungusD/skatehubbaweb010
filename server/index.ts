// Fullstack TypeScript wrapper - launches both frontend and backend
import { spawn } from 'child_process';
import path from 'path';

const serverPath = path.join(process.cwd(), 'server', 'index.js');

console.log('🔄 Starting SkateHubba fullstack application...');
console.log('🌐 Unified Server (Frontend + API): http://localhost:5000');

// Start unified server on port 5000 with tsx to handle TypeScript
// This server includes both the API and Vite middleware for the frontend
const apiServer = spawn('npx', ['tsx', serverPath], {
  stdio: 'pipe',
  env: { ...process.env, NODE_ENV: 'development', PORT: '5000' }
});

// No separate Vite server needed - it's integrated into the API server
const viteServer = null;

// Output handling with clear labels
apiServer.stdout?.on('data', (data) => {
  process.stdout.write(`${data}`);
});
apiServer.stderr?.on('data', (data) => {
  process.stderr.write(`${data}`);
});

// Handle process exits
apiServer.on('exit', (code) => {
  console.log(`\n🛑 Server exited with code ${code}`);
  process.exit(code || 0);
});

// Handle startup errors
apiServer.on('error', (error) => {
  console.error('❌ Failed to start server:', error);
  process.exit(1);
});

// Graceful shutdown handlers
process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down fullstack application...');
  apiServer.kill('SIGINT');
});

process.on('SIGTERM', () => {
  console.log('\n🛑 Shutting down fullstack application...');
  apiServer.kill('SIGTERM');
});