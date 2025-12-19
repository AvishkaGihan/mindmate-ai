import { initializeApp } from "firebase/app";
import { getAuth, Auth } from "firebase/auth";

/**
 * Firebase Configuration
 * These values are obtained from your Firebase Console project settings.
 * They are public (not secrets) but project-identifiable.
 */
const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY || "",
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN || "",
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID || "",
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET || "",
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "",
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID || "",
};

/**
 * Firebase App Initialization
 * Only initializes once, even if called multiple times.
 */
const app = initializeApp(firebaseConfig);

/**
 * Firebase Authentication Instance
 * Used for user sign-up, login, and ID token generation.
 */
export const auth: Auth = getAuth(app);

/**
 * Optional: Enable local authentication emulator for development
 * Uncomment to use Firebase Emulator Suite
 */
// if (__DEV__) {
//   try {
//     connectAuthEmulator(auth, "http://localhost:9099", { disableWarnings: true });
//   } catch (error) {
//     // Emulator already connected or not running
//   }
// }

export default app;
