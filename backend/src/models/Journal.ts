import mongoose, { Document, Schema } from "mongoose";

export interface IJournal extends Document {
  userId: string;
  // This content is DOUBLE encrypted (Device -> Server)
  encryptedContent: string;
  iv: string; // Server-side IV
  authTag: string; // Server-side AuthTag
  mood?: string;
  moodIntensity?: number;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

const JournalSchema = new Schema(
  {
    userId: { type: String, required: true, index: true },
    encryptedContent: { type: String, required: true },
    iv: { type: String, required: true },
    authTag: { type: String, required: true },
    mood: { type: String },
    moodIntensity: { type: Number },
    tags: [{ type: String }],
  },
  { timestamps: true }
);

export default mongoose.model<IJournal>("Journal", JournalSchema);
