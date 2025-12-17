import { create } from "zustand";
import { JournalEntry, JournalState, SyncOperation } from "../types";
import api from "../services/api";
import { storage } from "../services/storage";
import { offlineSyncService } from "../services/offlineSync";

/**
 * Journal Store
 * Manages journal entries, drafts, and offline synchronization logic.
 * Implements Optimistic UI updates to ensure the app feels instant.
 */

const STORAGE_KEYS = {
  DRAFT: "mindmate_journal_draft",
  OFFLINE_QUEUE: "mindmate_journal_queue",
};

// Helper to generate temporary IDs for optimistic updates
const generateTempId = () =>
  `temp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

export const useJournalStore = create<JournalState>((set, get) => ({
  journals: [],
  isLoading: false,
  offlineQueue: [],
  currentDraft: "",

  /**
   * Fetches journals from the backend.
   * Merges with local offline entries if they exist.
   */
  fetchJournals: async () => {
    set({ isLoading: true });
    try {
      const response = await api.get("/journals");
      const serverJournals: JournalEntry[] = response.data.data;

      // In a real offline-first app, we'd merge server data with local unsynced data
      // For this MVP, we prioritize server data but keep local optimistic updates if they aren't in the server list yet
      const currentQueue = get().offlineQueue;
      const optimisticIds = currentQueue
        .filter((op) => op.type === "CREATE_JOURNAL")
        .map((op) => op.payload._id);

      const mergedJournals = [
        ...serverJournals,
        ...get().journals.filter((j) => optimisticIds.includes(j._id)),
      ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

      set({ journals: mergedJournals, isLoading: false });
    } catch (error) {
      console.error("[JournalStore] Fetch failed:", error);
      set({ isLoading: false });
      // Keep existing data if fetch fails (stale-while-revalidate pattern)
    }
  },

  /**
   * Adds a new journal entry.
   * Uses Optimistic UI: updates state immediately, then tries network.
   * If network fails, adds to offline queue.
   */
  addJournal: async (entryData) => {
    const tempId = generateTempId();
    const now = new Date().toISOString();

    const newEntry: JournalEntry = {
      _id: tempId,
      userId: "currentUser", // Placeholder, verified by backend token
      date: entryData.date || now,
      content: entryData.content,
      mood: entryData.mood,
      tags: entryData.tags || [],
      createdAt: now,
      updatedAt: now,
      isSynced: false, // UI can show a "pending" icon
    };

    // 1. Optimistic Update
    set((state) => ({
      journals: [newEntry, ...state.journals],
    }));

    // Clear draft immediately
    set({ currentDraft: "" });
    storage.removeItem(STORAGE_KEYS.DRAFT);

    try {
      // 2. Network Request
      if (!offlineSyncService.getIsConnected()) {
        throw new Error("Offline");
      }

      const response = await api.post("/journals", entryData);
      const serverEntry = response.data.data;

      // 3. Success: Replace temp entry with server entry
      set((state) => ({
        journals: state.journals.map((j) =>
          j._id === tempId ? { ...serverEntry, isSynced: true } : j
        ),
      }));
    } catch {
      console.log("[JournalStore] Network failed, queuing for offline sync");

      // 4. Failure: Add to Offline Queue
      const operation: SyncOperation = {
        id: generateTempId(),
        type: "CREATE_JOURNAL",
        payload: { ...entryData, _id: tempId }, // Keep temp ID to reconcile later if needed
        timestamp: Date.now(),
        retryCount: 0,
      };

      const newQueue = [...get().offlineQueue, operation];
      set({ offlineQueue: newQueue });

      // Persist queue
      storage.setItem(STORAGE_KEYS.OFFLINE_QUEUE, newQueue);
    }
  },

  /**
   * Updates an existing journal entry.
   */
  updateJournal: async (id, updates) => {
    // 1. Optimistic Update
    set((state) => ({
      journals: state.journals.map((j) =>
        j._id === id
          ? {
              ...j,
              ...updates,
              isSynced: false,
              updatedAt: new Date().toISOString(),
            }
          : j
      ),
    }));

    try {
      if (!offlineSyncService.getIsConnected()) throw new Error("Offline");

      await api.put(`/journals/${id}`, updates);

      set((state) => ({
        journals: state.journals.map((j) =>
          j._id === id ? { ...j, isSynced: true } : j
        ),
      }));
    } catch {
      // Queue update op
      const operation: SyncOperation = {
        id: generateTempId(),
        type: "UPDATE_JOURNAL",
        payload: { id, updates },
        timestamp: Date.now(),
        retryCount: 0,
      };
      const newQueue = [...get().offlineQueue, operation];
      set({ offlineQueue: newQueue });
      storage.setItem(STORAGE_KEYS.OFFLINE_QUEUE, newQueue);
    }
  },

  /**
   * Deletes a journal entry.
   */
  deleteJournal: async (id) => {
    // 1. Optimistic Update
    set((state) => ({
      journals: state.journals.filter((j) => j._id !== id),
    }));

    try {
      if (!offlineSyncService.getIsConnected()) throw new Error("Offline");
      await api.delete(`/journals/${id}`);
    } catch {
      // Revert if it wasn't a temp ID and we really failed?
      // Or queue delete. Usually queue delete is safer.
      const operation: SyncOperation = {
        id: generateTempId(),
        type: "DELETE_JOURNAL",
        payload: { id },
        timestamp: Date.now(),
        retryCount: 0,
      };
      const newQueue = [...get().offlineQueue, operation];
      set({ offlineQueue: newQueue });
      storage.setItem(STORAGE_KEYS.OFFLINE_QUEUE, newQueue);
    }
  },

  /**
   * Processes the offline queue via the Sync Service.
   */
  processQueue: async () => {
    const queue = get().offlineQueue;
    if (queue.length === 0) return;

    try {
      await offlineSyncService.syncQueue(queue);

      // Clear queue on success
      set({ offlineQueue: [] });
      storage.removeItem(STORAGE_KEYS.OFFLINE_QUEUE);

      // Refresh journals to get canonical server state
      get().fetchJournals();
    } catch {
      console.error("[JournalStore] Sync failed, keeping queue");
    }
  },

  /**
   * Saves the current draft text locally.
   * Called on every text change (debounced in UI or here).
   */
  saveDraft: (text: string) => {
    set({ currentDraft: text });
    storage.setItem(STORAGE_KEYS.DRAFT, text);
  },

  /**
   * Loads persisted data (queue, draft) on startup.
   */
  hydrate: async () => {
    const [draft, queue] = await Promise.all([
      storage.getItem<string>(STORAGE_KEYS.DRAFT),
      storage.getItem<SyncOperation[]>(STORAGE_KEYS.OFFLINE_QUEUE),
    ]);

    set({
      currentDraft: draft || "",
      offlineQueue: queue || [],
    });
  },
}));
