
import fs from "node:fs";
import path from "node:path";

const CLIENT_SRC = path.resolve("client/src");
const exts = new Set([".ts", ".tsx"]);

function listFiles(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap(d => {
    const p = path.join(dir, d.name);
    return d.isDirectory() ? listFiles(p) : exts.has(path.extname(p)) ? [p] : [];
  });
}

function relativize(spec, fromFile) {
  // Handle @/x or src/x to relative
  let target = spec;
  if (spec.startsWith("@/")) target = path.join(CLIENT_SRC, spec.slice(2));
  else if (spec.startsWith("src/")) target = path.join(CLIENT_SRC, spec.slice(4));
  else return null; // leave non-alias imports

  // Add extension resolution candidates for TS
  const withExt = fs.existsSync(target) ? target
    : [".ts", ".tsx", ".js", ".jsx", "/index.ts", "/index.tsx"]
      .map(suf => target + suf).find(fs.existsSync);

  if (!withExt) return null;

  let rel = path.relative(path.dirname(fromFile), withExt).replaceAll("\\", "/");
  if (!rel.startsWith(".")) rel = "./" + rel;
  // strip extension for Vite
  return rel.replace(/(\.tsx?|\.jsx?)$/, "");
}

for (const file of listFiles(CLIENT_SRC)) {
  let text = fs.readFileSync(file, "utf8");
  const before = text;

  text = text.replace(
    /from\s+["']([^"']+)["']/g,
    (m, spec) => {
      const r = relativize(spec, file);
      return r ? `from "${r}"` : m;
    }
  );

  if (text !== before) {
    fs.writeFileSync(file, text);
    console.log("updated", path.relative(".", file));
  }
}
