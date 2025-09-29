// Custom Vite config to fix Replit host blocking
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,               // allow external connections
    allowedHosts: true,       // allow ALL hosts (permanent fix for Replit)
    port: 5000,
  },
  root: 'client',
  build: {
    outDir: '../dist/public',
    emptyOutDir: true,
    sourcemap: true
  },
  resolve: {
    alias: {
      '@': path.resolve(path.dirname(new URL(import.meta.url).pathname), './client/src'),
      '@shared': path.resolve(path.dirname(new URL(import.meta.url).pathname), './shared')
    }
  },
  publicDir: 'public'
});