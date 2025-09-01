import { exec } from "child_process";
import { promisify } from "util";
import { writeFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const execAsync = promisify(exec);
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, "..");

async function buildServer() {
  try {
    // Use TypeScript compiler for ESM-only build
    await execAsync("npx tsc -p tsconfig.server.json", { cwd: projectRoot });

    // Create package.json for production server
    const serverPackageJson = {
      type: "module",
      main: "index.js",
      exports: "./index.js"
    };

    writeFileSync(
      join(projectRoot, "dist/package.json"),
      JSON.stringify(serverPackageJson, null, 2),
    );

    console.log("✅ Server build completed successfully");
  } catch (error) {
    console.error("❌ Server build failed:", error);
    process.exit(1);
  }
}

buildServer();
