import mongoose, { Schema, Model } from "mongoose";
import bcrypt from "bcrypt";
import { IUser, Role, AuthProvider } from "../types";
import { moodSchema } from "./Mood";

/**
 * User Model
 * Represents the core user identity and aggregates high-frequency data
 * (Moods, Conversation History) using the Embedded Document pattern
 * to optimize for MongoDB Atlas Free Tier limitations.
 */

interface IUserMethods {
  comparePassword(candidatePassword: string): Promise<boolean>;
}

// Create a composite type for the Model to include static methods if needed (none for now)
type UserModel = Model<IUser, {}, IUserMethods>;

// Inline schema for conversation history (capped embedded document)
// We define this here as it is tightly coupled to the User context window for AI.
const messageSchema = new Schema(
  {
    role: {
      type: String,
      enum: ["user", "model"],
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: false } // No need for individual IDs for chat messages in context history
);

const userSchema = new Schema<any, UserModel, IUserMethods>(
  {
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    // Password is optional because Google Auth users might not have one
    password: {
      type: String,
      select: false, // Do not return password by default
    },
    name: {
      type: String,
      trim: true,
      default: "MindMate User",
    },
    firebaseUid: {
      type: String,
      required: [true, "Firebase UID is required"],
      unique: true,
      index: true,
    },
    provider: {
      type: String,
      enum: Object.values(AuthProvider),
      default: AuthProvider.EMAIL,
    },
    role: {
      type: String,
      enum: Object.values(Role),
      default: Role.USER,
    },
    preferences: {
      notificationsEnabled: {
        type: Boolean,
        default: true,
      },
      theme: {
        type: String,
        enum: ["light", "dark", "system"],
        default: "system",
      },
    },
    // Embedded Moods - Capped at 365
    moods: {
      type: [moodSchema],
      default: [],
      validate: [
        (val: any[]) => val.length <= 365,
        "{PATH} exceeds the limit of 365 entries",
      ],
    },
    // Embedded Chat Context - Capped at 50
    conversationHistory: {
      type: [messageSchema],
      default: [],
      validate: [
        (val: any[]) => val.length <= 50,
        "{PATH} exceeds the limit of 50 messages",
      ],
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// ============================================================================
// Middleware (Hooks)
// ============================================================================

// Hash password before saving
userSchema.pre<any>("save", function (next: any) {
  const doc: any = this;
  // Only hash the password if it has been modified (or is new)
  if (!doc.isModified("password")) return next();

  // If password exists (it might be missing for OAuth users), hash it
  if (doc.password) {
    bcrypt
      .genSalt(10)
      .then((salt: string) => bcrypt.hash(doc.password, salt))
      .then((hash: string) => {
        doc.password = hash;
        next();
      })
      .catch((error: Error) => next(error));
  } else {
    next();
  }
});

// ============================================================================
// Instance Methods
// ============================================================================

/**
 * Compares a candidate password with the user's hashed password.
 */
userSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  const doc: any = this;
  if (!doc.password) return false;
  return await bcrypt.compare(candidatePassword, doc.password);
};

const User = mongoose.model<IUser, UserModel>("User", userSchema);

export default User;
