import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,          // 0.0.0.0 on Replit
    port: 5173,
    strictPort: true,
    hmr: { clientPort: 443 } // fixes HMR over Replit proxy
  },
  preview: {
    host: true,
    port: 3000
  },
  build: {
    outDir: "dist",
    sourcemap: true
  }
});