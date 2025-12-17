import dotenv from "dotenv";
import { z } from "zod";

// Load environment variables from .env file
dotenv.config();

/**
 * Environment Variable Schema
 * Uses Zod to strictly validate configuration at startup.
 * If any variable is missing or invalid, the application will crash immediately
 * with a clear error message, preventing runtime failures later.
 */
const envSchema = z.object({
  // Infrastructure
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
  PORT: z
    .string()
    .transform((val) => parseInt(val, 10))
    .default(3000),

  // Database
  MONGO_URI: z.url("Invalid MongoDB URI"),

  // Authentication
  JWT_SECRET: z.string().min(32, "JWT_SECRET must be at least 32 chars"),
  JWT_REFRESH_SECRET: z
    .string()
    .min(32, "JWT_REFRESH_SECRET must be at least 32 chars"),
  JWT_EXPIRES_IN: z.string().default("24h"),
  JWT_REFRESH_EXPIRES_IN: z.string().default("7d"),

  // Firebase (Admin SDK)
  FIREBASE_PROJECT_ID: z.string().min(1),
  FIREBASE_CLIENT_EMAIL: z.email(),
  // Private keys often contain newlines which need strict handling
  FIREBASE_PRIVATE_KEY: z
    .string()
    .min(1)
    .transform((key) => {
      // Handle escaped newlines from .env formats
      return key.replace(/\\n/g, "\n");
    }),

  // AI Services
  GEMINI_API_KEY: z.string().min(1, "Gemini API Key is required"),
  GROQ_API_KEY: z.string().optional(), // Fallback is optional

  // Security
  // 32 bytes = 64 hex characters
  SERVER_ENCRYPTION_KEY: z
    .string()
    .length(
      64,
      "SERVER_ENCRYPTION_KEY must be a 64-char hex string (32 bytes)"
    ),

  // Logging
  LOG_LEVEL: z
    .enum(["error", "warn", "info", "http", "verbose", "debug", "silly"])
    .default("info"),

  // CORS Configuration
  CORS_ORIGIN: z
    .string()
    .transform((val) => {
      // Support comma-separated origins for multiple domains
      return val.split(",").map((origin) => origin.trim());
    })
    .default(() => ["http://localhost:3000"]),
});

// Validate process.env
const _env = envSchema.safeParse(process.env);

if (!_env.success) {
  console.error(
    "❌ Invalid environment variables:",
    JSON.stringify(_env.error.flatten(), null, 2)
  );
  process.exit(1);
}

const env = _env.data;

/**
 * Centralized Configuration Object
 * Exporting this ensures usage of validated values throughout the app.
 */
export const config = {
  env: env.NODE_ENV,
  port: env.PORT,
  db: {
    uri: env.MONGO_URI,
  },
  auth: {
    jwtSecret: env.JWT_SECRET,
    jwtRefreshSecret: env.JWT_REFRESH_SECRET,
    jwtExpiresIn: env.JWT_EXPIRES_IN,
    jwtRefreshExpiresIn: env.JWT_REFRESH_EXPIRES_IN,
  },
  firebase: {
    projectId: env.FIREBASE_PROJECT_ID,
    clientEmail: env.FIREBASE_CLIENT_EMAIL,
    privateKey: env.FIREBASE_PRIVATE_KEY,
  },
  ai: {
    geminiKey: env.GEMINI_API_KEY,
    groqKey: env.GROQ_API_KEY,
  },
  security: {
    serverEncryptionKey: env.SERVER_ENCRYPTION_KEY,
  },
  logging: {
    level: env.LOG_LEVEL,
  },
  cors: {
    origin: env.CORS_ORIGIN,
  },
} as const;
