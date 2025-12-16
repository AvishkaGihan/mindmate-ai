import { z } from "zod";
import { AppError } from "./AppError";
import { MoodState } from "../types";

/**
 * Request Validation Utilities
 * * Uses Zod to define schemas and validate incoming request bodies at runtime.
 * * Ensures data integrity before it reaches the Controller/Service layer.
 */

/**
 * Generic validator function.
 * Validates data against a Zod schema. Throws AppError if validation fails.
 * @param schema The Zod schema to validate against
 * @param data The input data (usually req.body)
 */
export const validate = <T>(schema: z.ZodSchema<T>, data: unknown): T => {
  const result = schema.safeParse(data);

  if (!result.success) {
    // Collect all validation errors into a readable string
    const errorMessages = result.error.issues
      .map((err: any) => `${err.path.join(".")}: ${err.message}`)
      .join("; ");

    throw new AppError(`Validation failed: ${errorMessages}`, 400);
  }

  return result.data;
};

// ============================================================================
// Auth Schemas
// ============================================================================

// Schema for the Firebase Login/Registration flow
export const firebaseAuthSchema = z.object({
  idToken: z.string().min(1, "Firebase ID Token is required"),
});

// Schema for refreshing access tokens
export const refreshTokenSchema = z.object({
  refreshToken: z.string().min(1, "Refresh Token is required"),
});

// ============================================================================
// Journal Schemas
// ============================================================================

export const journalSchema = z.object({
  // Content must be encrypted string (AES-256 ciphertext format)
  encryptedContent: z.string().min(1, "Encrypted content is required"),

  mood: z.enum(Object.values(MoodState) as [string, ...string[]]),

  intensity: z.number().int().min(1).max(10),

  // Accepts ISO date string or Date object
  date: z.coerce.date(),

  tags: z.array(z.string()).optional(),
});

export const journalUpdateSchema = journalSchema.partial().extend({
  // Prevent updating userId or _id explicitly via body if passed
  userId: z.never().optional(),
  _id: z.never().optional(),
});

// ============================================================================
// Mood Schemas
// ============================================================================

export const moodSchema = z.object({
  mood: z.enum(Object.values(MoodState) as [string, ...string[]]),
  intensity: z.number().int().min(1).max(10),
  note: z.string().max(500, "Note cannot exceed 500 characters").optional(),

  // Timestamp is optional (defaults to now() in model), but validated if provided
  timestamp: z.coerce.date().optional(),
});

// ============================================================================
// AI/Chat Schemas
// ============================================================================

export const chatMessageSchema = z.object({
  message: z
    .string()
    .min(1, "Message cannot be empty")
    .max(2000, "Message too long"),
  // Optional context for the AI (e.g., "I am feeling anxious")
  context: z.string().max(500).optional(),
});
