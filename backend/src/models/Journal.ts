import mongoose, { Schema, Model } from "mongoose";
import { IJournal, MoodState } from "../types";

/**
 * Journal Model
 * * Represents an encrypted journal entry.
 * * Security Note: The 'encryptedContent' field contains AES-256 Ciphertext.
 * The server CANNOT decrypt this field without the key, which is managed
 * via the Encryption Service (for encryption at rest) and the client (for end-to-end).
 * * Separation of Concerns: Journals are stored in a separate collection from Users
 * to allow for efficient indexing and to prevent the User document from hitting
 * the 16MB MongoDB document limit.
 */

type JournalModel = Model<IJournal>;

const journalSchema = new Schema<IJournal, JournalModel>(
  {
    userId: {
      type: String, // Stored as string to match User._id/firebaseUid referencing
      ref: "User",
      required: [true, "Journal must belong to a user"],
      index: true,
    },
    date: {
      type: Date,
      required: [true, "Entry date is required"],
      default: Date.now,
    },
    mood: {
      type: String,
      enum: Object.values(MoodState),
      required: [true, "Mood tag is required"],
    },
    intensity: {
      type: Number,
      min: 1,
      max: 10,
      required: [true, "Mood intensity is required"],
    },
    // CRITICAL: This field stores the AES-256 ciphertext.
    // Format: "iv:authTag:ciphertext" (Hex encoded)
    encryptedContent: {
      type: String,
      required: [true, "Content is required"],
    },
    // Optional separate IV field if not packed into the ciphertext string,
    // kept here for flexibility with the IJournal interface.
    iv: {
      type: String,
      select: false, // Don't return by default
    },
    tags: {
      type: [String],
      default: [],
      index: true, // Allows filtering by tags without decryption
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// ============================================================================
// Indexes
// ============================================================================

// Compound index for efficient timeline queries (e.g., "Get my journals from Dec 2025")
journalSchema.index({ userId: 1, date: -1 });

const Journal = mongoose.model<IJournal, JournalModel>(
  "Journal",
  journalSchema
);

export default Journal;
