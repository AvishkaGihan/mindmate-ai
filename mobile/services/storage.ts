import AsyncStorage from "@react-native-async-storage/async-storage";

/**
 * Local Storage Service
 * Wrapper around AsyncStorage for persisting NON-SENSITIVE application state.
 * * ⚠️ SECURITY WARNING:
 * Do NOT store authentication tokens, passwords, or private journal entries here.
 * Use encryption.ts for sensitive data.
 * * Best suited for:
 * - User preferences (theme, notification settings)
 * - Onboarding flags (hasSeenWelcome)
 * - Cached non-private data
 */

export const StorageKeys = {
  THEME_PREFERENCE: "mindmate_theme_pref", // 'light' | 'dark' | 'system'
  HAS_SEEN_ONBOARDING: "mindmate_onboarding_complete", // 'true'
  LAST_SYNC_TIMESTAMP: "mindmate_last_sync", // ISO Date string
  CACHED_MOOD_STATS: "mindmate_cached_stats", // JSON object
  NOTIFICATION_SETTINGS: "mindmate_notif_settings", // JSON object
};

export const storage = {
  /**
   * Saves a value to local storage.
   * Automatically stringifies objects.
   * @param key Storage key
   * @param value String or Object to store
   */
  setItem: async (key: string, value: any): Promise<void> => {
    try {
      const jsonValue =
        typeof value === "string" ? value : JSON.stringify(value);
      await AsyncStorage.setItem(key, jsonValue);
    } catch (e) {
      console.error(`[Storage] Error saving key: ${key}`, e);
      // Fail silently in production, or rethrow if critical
    }
  },

  /**
   * Retrieves a value from local storage.
   * Automatically parses JSON if possible.
   * @param key Storage key
   * @returns The stored value or null if not found
   */
  getItem: async <T>(key: string): Promise<T | null> => {
    try {
      const jsonValue = await AsyncStorage.getItem(key);
      if (jsonValue === null) return null;

      // Try parsing as JSON, fallback to string
      try {
        return JSON.parse(jsonValue) as T;
      } catch {
        return jsonValue as unknown as T;
      }
    } catch (e) {
      console.error(`[Storage] Error reading key: ${key}`, e);
      return null;
    }
  },

  /**
   * Removes a specific item from storage.
   * @param key Storage key
   */
  removeItem: async (key: string): Promise<void> => {
    try {
      await AsyncStorage.removeItem(key);
    } catch (e) {
      console.error(`[Storage] Error removing key: ${key}`, e);
    }
  },

  /**
   * Clears all app-specific keys from storage.
   * Useful during logout or app reset.
   */
  clearAll: async (): Promise<void> => {
    try {
      const keys = Object.values(StorageKeys);
      await AsyncStorage.multiRemove(keys);
    } catch (e) {
      console.error("[Storage] Error clearing storage", e);
    }
  },
};
