// ==========================================
// Domain Models (CamelCase maps to DB snake_case)
// ==========================================

export interface User {
  id: string;
  email: string;
  passwordHash: string;
  createdAt: Date;
  updatedAt: Date;
}

// Public user profile (sensitive data excluded)
export type UserProfile = Omit<User, 'passwordHash'>;

export interface MoodLog {
  id: string;
  userId: string;
  moodScore: number; // 1-5
  tags: string[];
  context: Record<string, unknown>; // Flexible JSON context
  createdAt: Date;
}

export interface JournalEntry {
  id: string;
  userId: string;
  contentEncrypted: string; // Base64 encoded ciphertext
  metadata: JournalMetadata;
  createdAt: Date;
  updatedAt: Date;
}

export interface JournalMetadata {
  moodScore?: number;
  tags?: string[];
  [key: string]: unknown;
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export interface Conversation {
  id: string;
  userId: string;
  messages: ChatMessage[];
  createdAt: Date;
  updatedAt: Date;
}

// ==========================================
// Sync & Offline Operations
// ==========================================

export type SyncStatus = 'pending' | 'processing' | 'completed' | 'failed';

export type SyncOperationType =
  | 'mood:created'
  | 'mood:updated'
  | 'journal:entry:created'
  | 'journal:entry:updated'
  | 'journal:entry:deleted'
  | 'conversation:updated';

export interface SyncOperationPayload {
  type: SyncOperationType;
  data: unknown; // Specific payload depends on type
  clientId: string;
  enqueuedAt: string;
}

export interface SyncQueueItem {
  id: string;
  userId: string;
  operation: SyncOperationPayload;
  status: SyncStatus;
  createdAt: Date;
  syncedAt?: Date;
}

// ==========================================
// API Request/Response Contracts
// ==========================================

export interface ApiErrorDetail {
  field?: string;
  constraint?: string;
  [key: string]: unknown;
}

export interface ApiError {
  code: string;
  message: string;
  details?: ApiErrorDetail;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: ApiError;
}

// Auth Payloads
export interface SignupRequest {
  email: string;
  password: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: UserProfile;
  token: string;
}

// ==========================================
// Express Request Extensions
// ==========================================

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      user?: UserProfile; // Populated by auth middleware
    }
  }
}
