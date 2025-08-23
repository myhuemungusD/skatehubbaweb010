
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

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
      "@": path.resolve(__dirname, "./client/src"),
      "@shared": path.resolve(__dirname, "./shared")
    }
  },
  publicDir: "public"
});
