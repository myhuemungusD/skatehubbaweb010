
import { fileURLToPath } from "url";
import { dirname } from "path";
import { createRequire } from "module";

// __dirname replacement for ESM
export function getDirname(importMetaUrl: string) {
  const __filename = fileURLToPath(importMetaUrl);
  const __dirname = dirname(__filename);
  return { __filename, __dirname };
}

// require replacement for ESM
export function createRequireFromUrl(importMetaUrl: string) {
  return createRequire(importMetaUrl);
}
