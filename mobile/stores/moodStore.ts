import { create } from "zustand";
import { MoodState, MoodEntry, Mood } from "../types";
import api from "../services/api";
import { storage } from "../services/storage";

/**
 * Mood Store
 * Manages the user's mood history and aggregate insights.
 * Implements caching for "Stale-While-Revalidate" behavior on charts.
 */

const STORAGE_KEYS = {
  CACHED_STATS: "mindmate_mood_stats_cache",
  CACHED_HISTORY: "mindmate_mood_history_cache",
};

export const useMoodStore = create<MoodState>((set, get) => ({
  moods: [],
  isLoading: false,
  stats: {
    averageIntensity: 0,
    moodFrequency: {},
    daily: [],
  },

  /**
   * Logs a new mood entry.
   * Optimistically updates the history list.
   */
  logMood: async (mood: Mood, intensity: number, note?: string) => {
    const newEntry: MoodEntry = {
      _id: `temp_${Date.now()}`,
      mood,
      intensity,
      note,
      timestamp: new Date().toISOString(),
    };

    // 1. Optimistic Update (Prepend to history)
    const currentMoods = get().moods;
    set({ moods: [newEntry, ...currentMoods] });

    try {
      // 2. Network Request
      await api.post("/moods", { mood, intensity, note });

      // 3. Refresh data to get canonical ID and updated stats
      // We don't await this to keep UI responsive, but it runs in background
      get().fetchHistory();
      get().fetchStats();
    } catch (error) {
      console.error("[MoodStore] Log mood failed:", error);
      // Revert optimistic update
      set({ moods: currentMoods });
      throw error; // Let UI handle the error (e.g. show toast)
    }
  },

  /**
   * Fetches mood history.
   * Supports caching to show data immediately while fetching fresh data.
   */
  fetchHistory: async (range = "7d") => {
    set({ isLoading: true });

    // Try cache first
    const cached = await storage.getItem<MoodEntry[]>(
      STORAGE_KEYS.CACHED_HISTORY
    );
    if (cached) {
      set({ moods: cached, isLoading: false });
    }

    try {
      const response = await api.get(`/moods?range=${range}`);
      const history = response.data.data;

      set({ moods: history, isLoading: false });

      // Update cache
      storage.setItem(STORAGE_KEYS.CACHED_HISTORY, history);
    } catch (error) {
      console.error("[MoodStore] Fetch history failed:", error);
      set({ isLoading: false });
    }
  },

  /**
   * Fetches aggregated statistics for charts.
   * Uses "Stale-While-Revalidate" strategy.
   */
  fetchStats: async (range = "30d") => {
    // Try cache first
    const cachedStats = await storage.getItem<any>(STORAGE_KEYS.CACHED_STATS);
    if (cachedStats) {
      set({ stats: cachedStats });
    }

    try {
      const response = await api.get("/moods/insights", { params: { range } });
      const freshStats = response.data.data;

      set({ stats: freshStats });
      storage.setItem(STORAGE_KEYS.CACHED_STATS, freshStats);
    } catch (error) {
      console.error("[MoodStore] Fetch stats failed:", error);
    }
  },
}));
