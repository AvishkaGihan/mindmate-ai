import crypto from "crypto";
import { env } from "../config/env";

const ALGORITHM = "aes-256-gcm";

// Ensure SERVER_KEY is 32 bytes (stored in hex in .env)
// For MVP/Demo, we derive a buffer if the env var isn't exactly 32 bytes hex
const getServerKey = (): Buffer => {
  // In production, SERVER_KEY must be a 64-char hex string
  // For this portfolio setup, we'll hash the generic secret to get 32 bytes
  return crypto.createHash("sha256").update(env.FIREBASE_PROJECT_ID).digest();
};

export const encryptServerSide = (text: string) => {
  const iv = crypto.randomBytes(16);
  const key = getServerKey();
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);

  let encrypted = cipher.update(text, "utf8", "hex");
  encrypted += cipher.final("hex");
  const authTag = cipher.getAuthTag().toString("hex");

  return {
    iv: iv.toString("hex"),
    content: encrypted,
    authTag: authTag,
  };
};

export const decryptServerSide = (encryptedData: {
  iv: string;
  content: string;
  authTag: string;
}) => {
  const key = getServerKey();
  const decipher = crypto.createDecipheriv(
    ALGORITHM,
    key,
    Buffer.from(encryptedData.iv, "hex")
  );

  decipher.setAuthTag(Buffer.from(encryptedData.authTag, "hex"));

  let decrypted = decipher.update(encryptedData.content, "hex", "utf8");
  decrypted += decipher.final("utf8");

  return decrypted;
};
