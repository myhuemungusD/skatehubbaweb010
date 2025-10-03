
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from "path";
import { fileURLToPath } from "node:url";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true,          // bind to all interfaces
    port: process.env.PORT || 3000,
    allowedHosts: true   // accept any *.replit.app host
  },
  root: "client",
  preview: { 
    host: "0.0.0.0", 
    port: 3000 
  },
  build: {
    outDir: "../dist/public",
    emptyOutDir: true,
    sourcemap: true
  },
  resolve: {
    alias: {
      "@": path.resolve(path.dirname(fileURLToPath(import.meta.url)), "./client/src"),
      "@shared": path.resolve(path.dirname(fileURLToPath(import.meta.url)), "./shared")
    }
  },
  publicDir: "public"
});
