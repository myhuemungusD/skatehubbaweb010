import { build } from "esbuild";
import { writeFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, "..");

async function buildServer() {
  try {
    await build({
      entryPoints: [join(projectRoot, "server/index.ts")],
      bundle: true,
      outfile: join(projectRoot, "dist/server/index.js"),
      platform: "node",
      target: "node18",
      format: "esm",
      external: ["pg-native", "cpu-features", "@react-email/render"],
      define: {
        "process.env.NODE_ENV": '"production"',
      },
      sourcemap: true,
      minify: true,
      logLevel: "info",
    });

    // Create package.json for production server
    const serverPackageJson = {
      type: "module",
      dependencies: {},
    };

    writeFileSync(
      join(projectRoot, "dist/server/package.json"),
      JSON.stringify(serverPackageJson, null, 2),
    );

    console.log("✅ Server build completed successfully");
  } catch (error) {
    console.error("❌ Server build failed:", error);
    process.exit(1);
  }
}

buildServer();
