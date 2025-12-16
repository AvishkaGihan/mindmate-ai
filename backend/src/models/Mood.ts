import { Schema } from "mongoose";
import { IMood, MoodState } from "../types";

/**
 * Mood Schema
 * * Defines the structure for a single mood log entry.
 * * Usage: This is an embedded sub-document within the User model,
 * not a standalone model. It is defined here for modularity and reusability.
 * * Validation: Enforces strict typing on 'mood' and 'intensity' to ensure data integrity
 * for analytics.
 */

export const moodSchema = new Schema<IMood>(
  {
    mood: {
      type: String,
      enum: {
        values: Object.values(MoodState),
        message: "{VALUE} is not a supported mood state",
      },
      required: [true, "Mood is required"],
    },
    intensity: {
      type: Number,
      min: [1, "Intensity must be at least 1"],
      max: [10, "Intensity cannot exceed 10"],
      required: [true, "Intensity is required"],
    },
    note: {
      type: String,
      maxlength: [500, "Note cannot exceed 500 characters"],
      trim: true,
      // Note is optional and stored in plaintext (per Architecture/Privacy policy:
      // "General mood notes are not E2E encrypted to allow for server-side sentiment trends,
      // unlike deep journal entries which are.")
    },
    timestamp: {
      type: Date,
      default: Date.now,
      required: true,
    },
  },
  {
    _id: false, // Embedded documents don't necessarily need their own _id in this context
    timestamps: false, // We use a custom 'timestamp' field
  }
);
