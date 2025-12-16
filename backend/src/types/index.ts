/**
 * Global Type Definitions for MindMate AI Backend
 * Serves as the source of truth for data structures across Models, Controllers, and Services.
 */

// ============================================================================
// Enums
// ============================================================================

export enum Role {
  USER = "user",
  ADMIN = "admin",
}

export enum MoodState {
  PEACEFUL = "Peaceful",
  CONTENT = "Content",
  ANXIOUS = "Anxious",
  STRESSED = "Stressed",
  SAD = "Sad",
  ANGRY = "Angry",
  OVERWHELMED = "Overwhelmed",
}

export enum AuthProvider {
  EMAIL = "email",
  GOOGLE = "google",
}

// ============================================================================
// Core Interfaces (Data Models)
// ============================================================================

export interface IMood {
  mood: MoodState;
  intensity: number; // 1-10
  note?: string; // Optional plain text note (not encrypted)
  timestamp: Date;
}

export interface IConversationMessage {
  role: "user" | "model";
  content: string;
  timestamp: Date;
}

export interface IUser {
  _id?: string;
  email: string;
  name?: string;
  firebaseUid: string; // Link to Firebase Auth
  provider: AuthProvider;
  role: Role;
  preferences: {
    notificationsEnabled: boolean;
    theme: "light" | "dark" | "system";
  };
  // Embedded documents with strict capping in Mongoose Schema
  moods: IMood[];
  conversationHistory: IConversationMessage[];
  createdAt: Date;
  updatedAt: Date;
}

export interface IJournal {
  _id?: string;
  userId: string; // Reference to User._id
  date: Date;
  mood: MoodState;
  intensity: number;
  encryptedContent: string; // AES-256 Ciphertext
  iv?: string; // Initialization Vector (if storing separately, usually packed in ciphertext)
  tags?: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface IAffirmation {
  _id?: string;
  userId: string;
  text: string;
  theme: string; // e.g., 'resilience', 'anxiety'
  viewed: boolean;
  createdAt: Date; // Used for TTL index
}

// ============================================================================
// Authentication Types
// ============================================================================

export interface JwtPayload {
  userId: string;
  email: string;
  role: Role;
  iat?: number;
  exp?: number;
}

// ============================================================================
// API Response Structures
// ============================================================================

export interface ApiResponse<T = any> {
  status: "success" | "error";
  data?: T;
  message?: string;
  code?: string; // Error code e.g., 'RATE_LIMIT_EXCEEDED'
  requestId?: string; // For tracing
  metadata?: Record<string, any>; // Pagination, retries, etc.
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}
