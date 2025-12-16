import CryptoJS from "crypto-js";
import { storeSecureItem, getSecureItem } from "./storage";

const KEY_ALIAS = "mindmate_master_key";

// 1. Get or Generate Master Key
// In a real app, this should be wrapped by User Password or Biometrics
export const getMasterKey = async (): Promise<string> => {
  let key = await getSecureItem(KEY_ALIAS);

  if (!key) {
    // Generate a random 256-bit key
    key = CryptoJS.lib.WordArray.random(32).toString();
    await storeSecureItem(KEY_ALIAS, key);
  }

  return key;
};

// 2. Encrypt Payload (Layer 1)
export const encryptDeviceSide = async (text: string): Promise<string> => {
  const key = await getMasterKey();
  const encrypted = CryptoJS.AES.encrypt(text, key).toString();
  return encrypted;
};

// 3. Decrypt Payload (Layer 1)
export const decryptDeviceSide = async (
  cipherText: string
): Promise<string> => {
  const key = await getMasterKey();
  const bytes = CryptoJS.AES.decrypt(cipherText, key);
  return bytes.toString(CryptoJS.enc.Utf8);
};
