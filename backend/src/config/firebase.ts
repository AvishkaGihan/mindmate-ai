import admin from "firebase-admin";
import { config } from "./env";

/**
 * Firebase Admin SDK Initialization
 * Required for verifying ID tokens sent from the client side during authentication.
 */

try {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: config.firebase.projectId,
      clientEmail: config.firebase.clientEmail,
      privateKey: config.firebase.privateKey,
    }),
  });

  console.info("✅ Firebase Admin Initialized successfully");
} catch (error) {
  console.error("❌ Firebase Admin Initialization Failed:", error);
  // We do not exit the process here immediately, as some dev modes might mock auth,
  // but in production, this is critical.
  if (config.env === "production") {
    process.exit(1);
  }
}

// Export the auth service for verifying tokens
export const firebaseAuth = admin.auth();
