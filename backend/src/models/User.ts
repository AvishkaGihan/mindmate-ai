import mongoose, { Document, Schema } from "mongoose";
import {
  IUser,
  Role,
  AuthProvider,
  IMood,
  IConversationMessage,
} from "../types";

/**
 * User Schema
 * Stores user identity, preferences, and embedded documents (moods, conversation history).
 * Capping strategies:
 * - moods: Capped at 100 entries per user (manage in controller)
 * - conversationHistory: Capped at 50 messages per user (manage in controller)
 */
const UserSchema: Schema = new Schema<IUser>(
  {
    firebaseUid: {
      type: String,
      required: true,
      unique: true,
      index: true,
      description: "Firebase Authentication UID",
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      match: /.+\@.+\..+/,
    },
    name: {
      type: String,
      default: "MindMate User",
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
    // Embedded documents with capping managed in controllers
    moods: {
      type: [
        {
          mood: String,
          intensity: Number,
          note: String,
          timestamp: Date,
        },
      ],
      default: [],
    },
    conversationHistory: {
      type: [
        {
          role: { type: String, enum: ["user", "model"] },
          content: String,
          timestamp: Date,
        },
      ],
      default: [],
    },
  },
  { timestamps: true }
);

// Index for faster queries on firebaseUid
UserSchema.index({ firebaseUid: 1 });
UserSchema.index({ email: 1 });

export default mongoose.model<IUser>("User", UserSchema);
