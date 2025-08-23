import fs from "node:fs";
import path from "node:path";

const fail = (m) => { console.error("DEPLOY BLOCKED:", m); process.exit(1); };

// 1) index.html location
if (!fs.existsSync("client/index.html")) fail("client/index.html missing");

// 2) vite root sanity
const viteCfg = fs.readFileSync("vite.config.ts","utf8");
if (!/root:\s*["']client["']/.test(viteCfg)) fail("vite.config.ts must set root:'client'");

// 3) env names - check for client-side Firebase config that should be VITE_ prefixed
const clientFirebaseKeys = ["FIREBASE_API_KEY", "FIREBASE_PROJECT_ID", "FIREBASE_APP_ID"];
const badEnv = clientFirebaseKeys.some(key => process.env[key] && !key.startsWith("VITE_"));
if (badEnv) fail("Client Firebase envs must be prefixed VITE_*");

// 4) disallow temperature override for host SDKs
const scan = (dir) => fs.readdirSync(dir, { withFileTypes: true }).flatMap(d => {
  const p = path.join(dir, d.name);
  if (d.isDirectory()) return scan(p);
  if (/\.(t|j)sx?$/.test(d.name)) return [p];
  return [];
});
const files = fs.existsSync("client/src") ? scan("client/src") : [];
const tempHits = files.filter(f => /temperature\s*:\s*(0\.\d+|[2-9])/i.test(fs.readFileSync(f, "utf8")));
if (tempHits.length) fail(`Remove non-default temperature in: ${tempHits.join(", ")}`);

// 5) base path
if (/base:\s*["']\//.test(viteCfg) === false && viteCfg.includes("base:")) {
  fail("Remove custom base or set correct subpath; for root deployments omit base");
}

console.log("Doctor passed");