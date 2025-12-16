import mongoose, { Schema, Model } from "mongoose";
import { IAffirmation } from "../types";

/**
 * Affirmation Model
 * * Stores AI-generated daily affirmations.
 * * Optimization: Uses MongoDB's TTL (Time-To-Live) index to automatically
 * delete entries after 7 days. This ensures the database doesn't grow indefinitely
 * with ephemeral content, respecting the Free Tier 512MB limit.
 */

type AffirmationModel = Model<IAffirmation>;

const affirmationSchema = new Schema<IAffirmation, AffirmationModel>(
  {
    userId: {
      type: String,
      ref: "User",
      required: [true, "Affirmation must belong to a user"],
      index: true,
    },
    text: {
      type: String,
      required: [true, "Affirmation text is required"],
      trim: true,
    },
    theme: {
      type: String,
      default: "general", // e.g., 'anxiety', 'confidence', 'sleep'
    },
    viewed: {
      type: Boolean,
      default: false,
    },
    createdAt: {
      type: Date,
      default: Date.now,
      // This field drives the TTL index
    },
  },
  {
    timestamps: true, // Adds updatedAt automatically
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// ============================================================================
// Indexes
// ============================================================================

// 1. TTL Index: Automatically remove documents 7 days (604800 seconds) after creation
affirmationSchema.index({ createdAt: 1 }, { expireAfterSeconds: 604800 });

// 2. Uniqueness: Prevent the exact same affirmation for a user while it exists in the DB
// This forces the AI to generate fresh content if the same text is suggested within 7 days.
affirmationSchema.index({ userId: 1, text: 1 }, { unique: true });

const Affirmation = mongoose.model<IAffirmation, AffirmationModel>(
  "Affirmation",
  affirmationSchema
);

export default Affirmation;
