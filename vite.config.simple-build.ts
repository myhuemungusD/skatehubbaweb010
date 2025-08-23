import { defineConfig } from "vite";

export default defineConfig({
  root: "client",                 // where index.html lives
  server: { host: true, port: 5173, strictPort: true, hmr: { clientPort: 443 } },
  preview: { host: true, port: 3000 },
  build: {
    outDir: "../dist/client",     // write build outside /client
    emptyOutDir: true,            // clear the output folder
  },
  publicDir: "public",            // resolves to client/public
  css: {
    postcss: false                // disable PostCSS temporarily
  }
});