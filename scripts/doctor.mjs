import fs from "node:fs";
import path from "node:path";

const fail = (m) => { console.error("DEPLOY BLOCKED:", m); process.exit(1); };
const ok = (m) => console.log("✓", m);

// 1) index.html present
if (!fs.existsSync("client/index.html")) fail("client/index.html missing");
ok("index.html found");

// 2) single Vite config at root with root:'client'
const vPath = "vite.config.ts";
if (!fs.existsSync(vPath)) fail("vite.config.ts missing at repo root");
const viteCfg = fs.readFileSync(vPath, "utf8");
if (!/root:\s*["']client["']/.test(viteCfg)) fail("vite.config.ts must set root:'client'");
ok("vite root set");

// 3) no duplicate vite configs
const walk = (dir) => {
  if (dir.includes('node_modules') || dir.includes('.config')) return [];
  return fs.readdirSync(dir, { withFileTypes: true })
    .flatMap(d => d.isDirectory() ? walk(path.join(dir, d.name)) : [path.join(dir, d.name)]);
};
const all = walk(".");
const dup = all.filter(p => /vite\.config\.(t|j)s/.test(p) && p !== "vite.config.ts");
if (dup.length) fail(`remove extra vite configs: ${dup.join(", ")}`);
ok("no duplicate vite configs");

// 4) client envs must be VITE_*
const envFiles = [".env", ".env.production", ".env.local"].filter(f => fs.existsSync(f));
for (const f of envFiles) {
  const txt = fs.readFileSync(f, "utf8");
  if (/^\s*(FIREBASE|OPENAI|STRIPE)[A-Z_]*=.*/gim.test(txt)) {
    fail(`Move client-facing secrets to VITE_* in ${f}`);
  }
}
ok("env names sane");

// 5) write health artifact
if (!fs.existsSync("client/public")) fs.mkdirSync("client/public", { recursive: true });
const meta = { build: process.env.REPL_SLUG || "local", ts: new Date().toISOString() };
fs.writeFileSync("client/public/version.txt", JSON.stringify(meta));
ok("version.txt written");

console.log("Doctor passed");