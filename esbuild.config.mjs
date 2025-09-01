import { build } from "esbuild";

// ESBuild configuration for server bundling
const config = {
  entryPoints: ["server/index.ts"],
  bundle: true,
  platform: "node",
  outfile: "dist/server.js",
  format: "cjs",
  packages: "external", // This automatically excludes all Node.js built-ins
  external: [
    "pg-native",
    "cpu-features",
    "@react-email/render",
    "cookie-parser",
    "express",
    "cors",
    "helmet",
    "compression",
    "pino-http",
    "express-rate-limit",
    "jsonwebtoken",
    "bcryptjs",
    "nodemailer",
    "firebase-admin",
    "stripe",
    "ws"
  ],
  target: "node18",
  minify: false,
  sourcemap: true,
};

build(config).catch(() => process.exit(1));