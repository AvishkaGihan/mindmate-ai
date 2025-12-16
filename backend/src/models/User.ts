import mongoose, { Document, Schema } from "mongoose";

export interface IUser extends Document {
  uid: string; // Firebase UID
  email: string;
  name?: string;
  createdAt: Date;
  conversationHistory: {
    role: "user" | "model";
    content: string;
    timestamp: Date;
  }[];
}

const UserSchema: Schema = new Schema(
  {
    uid: { type: String, required: true, unique: true, index: true },
    email: { type: String, required: true, unique: true },
    name: { type: String },
    // Embedded moods limit managed in Mood Controller (Phase 3)
    moods: { type: [Schema.Types.Mixed], default: [] },
    conversationHistory: {
      type: [
        {
          role: { type: String, enum: ["user", "model"] },
          content: String,
          timestamp: Date,
        },
      ],
      default: [], // Capped at 50 in controller
    },
  },
  { timestamps: true }
);

export default mongoose.model<IUser>("User", UserSchema);
