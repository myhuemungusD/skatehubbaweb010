import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  root: "client",
  plugins: [react()],
  server: { host: true, port: 5173, strictPort: true, hmr: { clientPort: 443 } },
  preview: { host: true, port: 3000 },
  build: {
    outDir: "../dist/public",
    emptyOutDir: true,
  },
  publicDir: "public"
});
