import { storage } from "./storage.ts";
import { validateEnvironment } from "./security.ts";

async function runPreDeploymentTests() {
  console.log("🚀 Starting pre-deployment tests...");

  try {
    // Test 1: Environment validation
    console.log("Testing environment validation...");
    validateEnvironment();
    console.log("✅ Environment validation passed");

    // Test 2: Storage connection
    console.log("Testing storage connection...");
    const testKey = `test-${Date.now()}`;
    await storage.set(testKey, { test: true });
    const retrieved = await storage.get(testKey);
    if (retrieved?.test !== true) {
      throw new Error("Storage test failed");
    }
    await storage.delete(testKey);
    console.log("✅ Storage connection test passed");

    console.log("🎉 All pre-deployment tests passed!");
    return true;
  } catch (error) {
    console.error("❌ Pre-deployment tests failed:", error);
    return false;
  }
}

if (import.meta.main) {
  runPreDeploymentTests().then(success => {
    process.exit(success ? 0 : 1);
  });
}

export { runPreDeploymentTests };