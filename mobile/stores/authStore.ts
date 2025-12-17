import { create } from "zustand";
import { User, AuthState } from "../types";
import { encryption, SecureKeys } from "../services/encryption";
import { storage } from "../services/storage";

/**
 * Auth Store
 * Manages global authentication state, token persistence, and user session data.
 * Acts as the source of truth for the app's protection layer.
 */

// Define the store state and actions
interface AuthStore extends AuthState {
  // Actions are already defined in AuthState interface in types/index.ts,
  // but we implement them here.
  hydrate: () => Promise<void>;
}

export const useAuthStore = create<AuthStore>((set, get) => ({
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
   * Logs the user in by updating state and persisting credentials.
   */
  login: async (user: User, accessToken: string, refreshToken: string) => {
    try {
      // 1. Update State
      set({
        user,
        token: accessToken,
        refreshToken,
        isAuthenticated: true,
      });

      // 2. Persist Data
      // We don't await these to block the UI update, but we catch errors if they fail
      Promise.all([
        encryption.storeSecureItem(SecureKeys.ACCESS_TOKEN, accessToken),
        encryption.storeSecureItem(SecureKeys.REFRESH_TOKEN, refreshToken),
        storage.setItem("user_profile", user),
      ]).catch((err) => {
        console.error("[AuthStore] Failed to persist login data", err);
      });
    } catch (error) {
      console.error("[AuthStore] Login action failed", error);
      throw error;
    }
  },

  /**
   * Logs the user out by clearing state and removing persisted credentials.
   */
  logout: async () => {
    try {
      // 1. Clear State immediately for UI responsiveness
      set({
        user: null,
        token: null,
        refreshToken: null,
        isAuthenticated: false,
      });

      // 2. Clear Persistence
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
