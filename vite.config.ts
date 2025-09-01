
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { fileURLToPath, URL } from "node:url";

export default defineConfig({
  plugins: [react()],
  root: "client",
  server: { 
    host: "0.0.0.0", 
    port: 5173, 
    strictPort: true, 
    hmr: { clientPort: 443 } 
  },
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
