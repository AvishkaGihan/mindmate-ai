import crypto from "crypto";
import { config } from "../config/env";

/**
 * Server-Side Encryption Service
 * * Implements the "Encryption at Rest" application layer.
 * This service wraps data (which may already be client-side encrypted)
 * with an additional layer of AES-256-GCM encryption before storing it in MongoDB.
 * * Flow:
 * Client Ciphertext -> Server Encrypt -> Database
 * Database -> Server Decrypt -> Client Ciphertext
 * * Security:
 * - Algorithm: AES-256-GCM (Galois/Counter Mode) for confidentiality and integrity.
 * - Key: Derived from SERVER_ENCRYPTION_KEY (32 bytes).
 * - IV: Random 16 bytes per operation, prepended to output.
 * - Auth Tag: 16 bytes, appended to output.
 */

const ALGORITHM = "aes-256-gcm";
const IV_LENGTH = 16;
const AUTH_TAG_LENGTH = 16;

// Ensure the key is a Buffer of correct length (32 bytes for AES-256)
const getKey = (): Buffer => {
  const keyHex = config.security.serverEncryptionKey;
  if (!keyHex || keyHex.length !== 64) {
    // 64 hex chars = 32 bytes
    throw new Error(
      "Critical Security Error: Invalid SERVER_ENCRYPTION_KEY length."
    );
  }
  return Buffer.from(keyHex, "hex");
};

/**
 * Encrypts a string using AES-256-GCM.
 * @param text The plaintext string (or client-side ciphertext).
 * @returns Format: "iv:authTag:ciphertext" (all hex encoded)
 */
export const encrypt = (text: string): string => {
  try {
    const key = getKey();
    const iv = crypto.randomBytes(IV_LENGTH);
    const cipher = crypto.createCipheriv(ALGORITHM, key, iv);

    let encrypted = cipher.update(text, "utf8", "hex");
    encrypted += cipher.final("hex");

    const authTag = cipher.getAuthTag().toString("hex");
    const ivHex = iv.toString("hex");

    // Format: iv:authTag:ciphertext
    return `${ivHex}:${authTag}:${encrypted}`;
  } catch (error) {
    throw new Error(`Encryption failed: ${(error as Error).message}`);
  }
};

/**
 * Decrypts a string using AES-256-GCM.
 * @param encryptedText Format: "iv:authTag:ciphertext"
 * @returns The original string.
 */
export const decrypt = (encryptedText: string): string => {
  try {
    const parts = encryptedText.split(":");

    // Integrity check for format
    if (parts.length !== 3) {
      throw new Error("Malformed ciphertext format.");
    }

    const [ivHex, authTagHex, contentHex] = parts;

    const key = getKey();
    const iv = Buffer.from(ivHex, "hex");
    const authTag = Buffer.from(authTagHex, "hex");

    const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
    decipher.setAuthTag(authTag);

    let decrypted = decipher.update(contentHex, "hex", "utf8");
    decrypted += decipher.final("utf8");

    return decrypted;
  } catch (error) {
    // We throw a generic error to avoid leaking cryptographic details
    // But logically, if this fails, data corruption or key mismatch occurred.
    throw new Error(
      "Decryption failed: Integrity check failed or invalid data."
    );
  }
};
