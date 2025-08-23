import { defineConfig } from "vite";

export default defineConfig({
  server: {
    host: true,
    port: 5173,
    strictPort: true,
    hmr: { clientPort: 443 }
  },
  preview: {
    host: true,
    port: 3000
  },
  build: {
    outDir: "dist/client",
    sourcemap: true
  }
});