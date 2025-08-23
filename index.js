// Entry point for production deployment
// This file imports and runs the built server from dist/server.js

import('./dist/server.js').catch(error => {
  console.error('Failed to start server:', error);
  process.exit(1);
});