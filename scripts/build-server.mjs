
import { build } from "esbuild";
import { builtinModules } from "node:module";
import fs from "node:fs";

const pkg = JSON.parse(fs.readFileSync("package.json", "utf8"));
const externals = [
  ...builtinModules,
  ...builtinModules.map(m => `node:${m}`),
  ...Object.keys(pkg.dependencies || {})
];

await build({
  entryPoints: ["server/production.ts"],
  outfile: "dist/server/index.js",
  platform: "node",
  target: "node18",
  format: "esm",
  bundle: true,
  external: externals,
  sourcemap: true
});

console.log("✅ Server built successfully with ESM format");
