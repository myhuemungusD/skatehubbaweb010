import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  root: "client",                 // where index.html lives
  plugins: [react()],
  server: { host: true, port: 5173, strictPort: true, hmr: { clientPort: 443 } },
  preview: { host: true, port: 3000 },
  build: {
    outDir: "../dist/client",     // write build outside /client
    emptyOutDir: true,            // clear the output folder
  },
  publicDir: "public"             // resolves to client/public
});