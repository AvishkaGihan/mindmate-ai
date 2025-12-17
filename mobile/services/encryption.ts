import EncryptedStorage from "react-native-encrypted-storage";

/**
 * Encryption & Secure Storage Service
 * Manages the secure storage of sensitive data using the device's hardware-backed keystore
 * (Keychain on iOS, Keystore on Android).
 *
 * ⚠️ CRITICAL:
 * This service requires a native development build (Prebuild).
 * It will NOT work in the standard Expo Go client because it relies on native modules.
 */

export const SecureKeys = {
  ACCESS_TOKEN: "mindmate_access_token",
  REFRESH_TOKEN: "mindmate_refresh_token",
  DEVICE_KEY: "mindmate_device_encryption_key", // Symmetric key for offline journal encryption
};

export const encryption = {
  /**
   * Securely stores a value.
   * @param key The key to store the value under.
   * @param value The value to store (string).
   */
  storeSecureItem: async (key: string, value: string): Promise<void> => {
    try {
      await EncryptedStorage.setItem(key, value);
    } catch (error) {
      console.error(`[Encryption] Failed to store secure item: ${key}`, error);
      throw new Error("Failed to secure data on device.");
    }
  },

  /**
   * Retrieves a securely stored value.
   * @param key The key to retrieve.
   * @returns The stored string or null if not found.
   */
  getSecureItem: async (key: string): Promise<string | null> => {
    try {
      const value = await EncryptedStorage.getItem(key);
      return value || null;
    } catch (error) {
      console.error(
        `[Encryption] Failed to retrieve secure item: ${key}`,
        error
      );
      return null;
    }
  },

  /**
   * Removes a specific item from secure storage.
   * @param key The key to remove.
   */
  removeSecureItem: async (key: string): Promise<void> => {
    try {
      await EncryptedStorage.removeItem(key);
    } catch (error) {
      console.error(`[Encryption] Failed to remove secure item: ${key}`, error);
    }
  },

  /**
   * Clears all data from secure storage.
   * CRITICAL: Call this only on explicit logout or account deletion.
   */
  clearSecureStorage: async (): Promise<void> => {
    try {
      await EncryptedStorage.clear();
    } catch (error) {
      console.error("[Encryption] Failed to clear secure storage", error);
    }
  },

  /**
   * Generates or retrieves a persistent symmetric key for local encryption.
   * If a key doesn't exist, it creates a new random one and stores it securely.
   * Used for encrypting journal entries before they hit the network or disk.
   */
  getOrCreateDeviceKey: async (): Promise<string> => {
    try {
      let key = await EncryptedStorage.getItem(SecureKeys.DEVICE_KEY);

      if (!key) {
        // Generate a simple random string for the device key (MVP approach)
        // In production, consider using a library like 'react-native-get-random-values'
        // or crypto.getRandomValues if available in the RN environment.
        const array = new Uint32Array(8);
        const randomValues = Array.from(array)
          .map(() => Math.random().toString(36).substring(2))
          .join("");
        key = randomValues;

        await EncryptedStorage.setItem(SecureKeys.DEVICE_KEY, key);
      }

      return key;
    } catch (error) {
      console.error("[Encryption] Failed to manage device key", error);
      throw error;
    }
  },
};
