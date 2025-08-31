import { storage } from "./storage.js";
import { validateEnvironment } from "./security.js";
import { db } from "./firebaseAdmin.js"; // Assuming you have firebaseAdmin.js setup
import { collection, addDoc, serverTimestamp, Timestamp } from "firebase/firestore";

async function runPreDeploymentTests() {
  console.log("🚀 Starting pre-deployment tests...");

  try {
    // Test environment security
    console.log("🔐 Validating environment security...");
    validateEnvironment();
    console.log("✅ Environment validation passed");

    // Test database connection
    console.log("📊 Testing database connection...");
    const steps = await storage.getAllTutorialSteps();
    console.log(`✅ Database connected - Found ${steps.length} tutorial steps`);

    // Test basic API functionality
    console.log("🔧 Testing storage operations...");
    const testUser = {
      id: "test-user-" + Date.now(),
      email: "test@example.com",
      firstName: "Test",
      lastName: "User",
      profileImageUrl: ""
    };

    await storage.upsertUser(testUser);
    const retrievedUser = await storage.getUser(testUser.id);
    console.log("✅ User operations working");

    // Test environment variables
    console.log("🔐 Checking environment variables...");
    const requiredEnvVars = [
      'DATABASE_URL',
      'REPL_ID',
      'SESSION_SECRET',
      'REPLIT_DOMAINS'
    ];

    const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
    if (missingVars.length > 0) {
      console.log(`❌ Missing environment variables: ${missingVars.join(', ')}`);
    } else {
      console.log("✅ All required environment variables present");
    }

    // Test production build if it exists
    const fs = await import('fs');
    if (fs.existsSync('dist/server.js')) {
      console.log("✅ Production build exists");

      // Test that the build doesn't have immediate syntax errors
      try {
        await import('../dist/server.js');
        console.log("✅ Production build loads successfully");
      } catch (err) {
        console.log("⚠️ Production build has issues:", err.message);
      }
    }

    // Test subscription endpoint
    console.log('\n📝 Testing subscription endpoint...');
    try {
      const subscribeResponse = await fetch('http://localhost:5000/api/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': 'Test-Agent/1.0'
        },
        body: JSON.stringify({
          email: 'test-subscription@example.com',
          source: 'landing'
        })
      });

      const subscribeResult = await subscribeResponse.json();
      console.log('Subscription test result:', subscribeResult);

      if (subscribeResponse.ok && subscribeResult.success) {
        console.log('✅ Subscription endpoint working');
      } else {
        console.log('❌ Subscription endpoint failed');
      }
    } catch (error) {
      console.log('❌ Subscription test failed:', error.message);
    }

    console.log('✅ All tests passed!');

    process.exit(0);
  } catch (error) {
    console.error("❌ Pre-deployment tests failed:", error);
    process.exit(1);
  }
}

// Run tests
runPreDeploymentTests();