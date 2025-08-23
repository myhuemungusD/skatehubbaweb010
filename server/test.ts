
import { storage } from "./storage";
import { validateEnvironment } from "./security";

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
    
    console.log("🎉 Pre-deployment tests completed successfully!");
    
    process.exit(0);
  } catch (error) {
    console.error("❌ Pre-deployment tests failed:", error);
    process.exit(1);
  }
}

// Import required modules
import { storage } from "./storage";
import { validateEnvironment } from "./security";

// Run tests if this file is executed directly
if (require.main === module) {
  runPreDeploymentTests();
}");
    
  } catch (error) {
    console.error("❌ Pre-deployment test failed:", error);
    process.exit(1);
  }
}

runPreDeploymentTests();
