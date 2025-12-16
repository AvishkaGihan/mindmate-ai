import EncryptedStorage from "react-native-encrypted-storage";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Securely store sensitive tokens (JWT)
export const storeSecureItem = async (key: string, value: string) => {
  try {
    await EncryptedStorage.setItem(key, value);
  } catch (error) {
    console.error("SecureStorage Error:", error);
  }
};

export const getSecureItem = async (key: string) => {
  try {
    return await EncryptedStorage.getItem(key);
  } catch (error) {
    console.error("SecureStorage Error:", error);
    return null;
  }
};

export const removeSecureItem = async (key: string) => {
  try {
    await EncryptedStorage.removeItem(key);
  } catch (error) {
    console.error("SecureStorage Error:", error);
  }
};

// Clear all storage (Logout)
export const clearStorage = async () => {
  await EncryptedStorage.clear();
  await AsyncStorage.clear();
};
