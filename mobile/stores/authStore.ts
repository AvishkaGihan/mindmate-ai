import { create } from "zustand";
import { User, AuthState } from "../types";
import { encryption, SecureKeys } from "../services/encryption";
import { storage } from "../services/storage";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "../services/firebase";
import api from "../services/api";

/**
 * Auth Store
 * Manages global authentication state, token persistence, and user session data.
 * Acts as the source of truth for the app's protection layer.
 */

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  token: null,
  refreshToken: null,
  isLoading: true, // Start true to block UI until hydration completes
  isAuthenticated: false,

  /**
   * Restores the user session from local storage on app launch.
   * This prevents the login screen from flashing for already authenticated users.
   */
  hydrate: async () => {
    try {
      set({ isLoading: true });

      // Parallel fetch for speed
      const [token, refreshToken, user] = await Promise.all([
        encryption.getSecureItem(SecureKeys.ACCESS_TOKEN),
        encryption.getSecureItem(SecureKeys.REFRESH_TOKEN),
        storage.getItem<User>("user_profile"), // We'll store the user object plainly
      ]);

      if (token && user) {
        // Valid session found
        set({
          token,
          refreshToken,
          user,
          isAuthenticated: true,
          isLoading: false,
        });
      } else {
        // No valid session
        set({
          token: null,
          refreshToken: null,
          user: null,
          isAuthenticated: false,
          isLoading: false,
        });
      }
    } catch (error) {
      console.error("[AuthStore] Hydration failed:", error);
      // Fallback to unauthenticated state
      set({
        token: null,
        user: null,
        isAuthenticated: false,
        isLoading: false,
      });
    }
  },

  /**
   * Logs the user out by clearing state and removing persisted credentials.
   */
  logout: async () => {
    try {
      // 1. Sign out from Firebase
      await signOut(auth);

      // 2. Clear State immediately for UI responsiveness
      set({
        user: null,
        token: null,
        refreshToken: null,
        isAuthenticated: false,
      });

      // 3. Clear Persistence
      await Promise.all([
        encryption.removeSecureItem(SecureKeys.ACCESS_TOKEN),
        encryption.removeSecureItem(SecureKeys.REFRESH_TOKEN),
        storage.removeItem("user_profile"),
      ]);

      // Optional: Clear specific app data if required by privacy policy
      // await storage.clearAll();
    } catch (error) {
      console.error("[AuthStore] Logout failed", error);
    }
  },

  /**
   * Exchanges Firebase ID token for backend JWT tokens.
   * This is called after Firebase signs in the user.
   */
  loginWithFirebaseToken: async (idToken: string) => {
    try {
      // Call /verify-token endpoint with Firebase ID token
      const response = await api.post("/auth/verify-token", { idToken });
      const { user, accessToken, refreshToken } = response.data.data;

      // Update state and persist tokens
      set({
        user,
        token: accessToken,
        refreshToken,
        isAuthenticated: true,
      });

      // Persist tokens to encrypted storage
      try {
        await Promise.all([
          encryption.storeSecureItem(SecureKeys.ACCESS_TOKEN, accessToken),
          encryption.storeSecureItem(SecureKeys.REFRESH_TOKEN, refreshToken),
          storage.setItem("user_profile", user),
        ]);
      } catch (err) {
        console.error("[AuthStore] Failed to persist tokens", err);
      }
    } catch (error) {
      console.error("[AuthStore] loginWithFirebaseToken failed", error);
      throw error;
    }
  },

  /**
   * Logs the user in using biometric authentication.
   * Retrieves stored refresh token and exchanges it for a new access token.
   */
  loginWithBiometric: async () => {
    try {
      // Retrieve stored refresh token from secure storage
      const storedRefreshToken = await encryption.getSecureItem(
        SecureKeys.REFRESH_TOKEN
      );

      if (!storedRefreshToken) {
        throw new Error(
          "No stored refresh token. Please login with email/password."
        );
      }

      // Exchange refresh token for new access token
      const response = await api.post("/auth/refresh-token", {
        refreshToken: storedRefreshToken,
      });
      const { accessToken } = response.data.data;

      // Update state
      set({ token: accessToken });

      // Persist new access token
      try {
        await encryption.storeSecureItem(SecureKeys.ACCESS_TOKEN, accessToken);
      } catch (err) {
        console.error("[AuthStore] Failed to persist new access token", err);
      }
    } catch (error) {
      console.error("[AuthStore] loginWithBiometric failed", error);
      throw error;
    }
  },

  /**
   * Initializes auth state from Firebase on app launch.
   * Listens to Firebase auth state changes and syncs with Zustand store.
   */
  initializeAuthFromFirebase: async () => {
    return new Promise<void>((resolve) => {
      const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
        try {
          if (firebaseUser) {
            // User is authenticated in Firebase
            const idToken = await firebaseUser.getIdToken();
            await get().loginWithFirebaseToken(idToken);
          } else {
            // User is not authenticated in Firebase
            await get().logout();
          }
        } catch (error) {
          console.error("[AuthStore] Firebase state sync failed", error);
          // Fall back to checking stored tokens
          await get().hydrate();
        } finally {
          unsubscribe();
          resolve();
        }
      });
    });
  },

  /**
   * Updates the local user profile state.
   * Useful for immediate UI updates after a profile edit.
   */
  updateUser: (updates: Partial<User>) => {
    const currentUser = get().user;
    if (!currentUser) return;

    const updatedUser = { ...currentUser, ...updates };

    set({ user: updatedUser });
    storage.setItem("user_profile", updatedUser);
  },
}));
