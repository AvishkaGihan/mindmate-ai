import crypto from 'crypto';
import { Buffer } from 'buffer';
import { config } from './env';

// AES-256-GCM configuration
const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 12; // 12 bytes for GCM
const KEY_LENGTH = 32; // 32 bytes = 256 bits

// Ensure the key is proper length (hashed or padded if necessary, but config validation should handle raw hex)
const ENCRYPTION_KEY = Buffer.from(config.encryptionKey, 'hex');

if (ENCRYPTION_KEY.length !== KEY_LENGTH) {
  throw new Error(
    `Invalid encryption key length: ${ENCRYPTION_KEY.length} bytes. Expected ${KEY_LENGTH} bytes (64 hex characters).`
  );
}

export interface EncryptedData {
  iv: string;
  tag: string;
  content: string;
}

/**
 * Encrypts a string using AES-256-GCM
 * Used for database-level encryption of sensitive but queryable fields (e.g., mood tags)
 */
export const encrypt = (text: string): EncryptedData => {
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(ALGORITHM, ENCRYPTION_KEY, iv);

  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');

  const authTag = cipher.getAuthTag();

  return {
    iv: iv.toString('hex'),
    content: encrypted,
    tag: authTag.toString('hex'),
  };
};

/**
 * Decrypts data using AES-256-GCM
 */
export const decrypt = (encrypted: EncryptedData): string => {
  const decipher = crypto.createDecipheriv(
    ALGORITHM,
    ENCRYPTION_KEY,
    Buffer.from(encrypted.iv, 'hex')
  );

  decipher.setAuthTag(Buffer.from(encrypted.tag, 'hex'));

  let decrypted = decipher.update(encrypted.content, 'hex', 'utf8');
  decrypted += decipher.final('utf8');

  return decrypted;
};

/**
 * Helper to encrypt a JSON object as a string
 */
export const encryptJSON = <T>(data: T): EncryptedData => {
  return encrypt(JSON.stringify(data));
};

/**
 * Helper to decrypt a string back to a JSON object
 */
export const decryptJSON = <T>(encrypted: EncryptedData): T => {
  const jsonString = decrypt(encrypted);
  return JSON.parse(jsonString);
};
