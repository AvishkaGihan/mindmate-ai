/**
 * Shared Type Definitions
 * Mirror backend types where appropriate, but adapted for frontend consumption.
 */

export type Mood =
  | "Peaceful"
  | "Content"
  | "Anxious"
  | "Stressed"
  | "Sad"
  | "Angry"
  | "Overwhelmed";

export interface User {
  id: string;
  email: string;
  name?: string;
  role?: string;
  preferences?: {
    theme?: "light" | "dark" | "system";
    notifications?: boolean;
    affirmationTime?: string; // HH:mm
  };
}

export interface MoodEntry {
  _id?: string; // Optional for local optimistically added moods
  mood: Mood;
  intensity: number; // 1-10
  note?: string;
  timestamp: string; // ISO Date string
}

export interface JournalEntry {
  _id: string;
  userId: string;
  date: string; // ISO Date string for the entry date (user selected)
  content: string; // Decrypted text content
  mood: Mood;
  tags?: string[];
  createdAt: string;
  updatedAt: string;
  isSynced?: boolean; // Frontend-only flag for offline usage
}

export interface Affirmation {
  _id: string;
  text: string;
  theme?: string;
  createdAt: string;
  isSaved?: boolean; // Frontend-only flag
}

export interface ChatMessage {
  id: string;
  role: "user" | "model";
  content: string;
  timestamp: string;
  isError?: boolean;
}

// ============================================================================
// State Interfaces (Zustand)
// ============================================================================

export interface AuthState {
  user: User | null;
  token: string | null; // JWT Access Token
  refreshToken: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (user: User, accessToken: string, refreshToken: string) => void;
  logout: () => void;
  updateUser: (updates: Partial<User>) => void;
}

export interface SyncOperation {
  id: string;
  type: "CREATE_JOURNAL" | "UPDATE_JOURNAL" | "DELETE_JOURNAL" | "LOG_MOOD";
  payload: any;
  timestamp: number;
  retryCount: number;
}

export interface JournalState {
  journals: JournalEntry[];
  isLoading: boolean;
  offlineQueue: SyncOperation[];
  fetchJournals: () => Promise<void>;
  addJournal: (
    entry: Omit<JournalEntry, "_id" | "userId" | "createdAt" | "updatedAt">
  ) => Promise<void>;
  updateJournal: (id: string, updates: Partial<JournalEntry>) => Promise<void>;
  deleteJournal: (id: string) => Promise<void>;
  processQueue: () => Promise<void>;
}

export interface MoodState {
  moods: MoodEntry[];
  isLoading: boolean;
  stats: {
    averageIntensity: number;
    moodFrequency: Record<string, number>;
    daily: any[];
  };
  logMood: (mood: Mood, intensity: number, note?: string) => Promise<void>;
  fetchHistory: (range?: string) => Promise<void>;
  fetchStats: (range?: string) => Promise<void>;
}
