import { create } from "zustand";
import { api } from "../services/api";
import { encryptDeviceSide, decryptDeviceSide } from "../services/encryption";
import { useAuthStore } from "./authStore";

export interface JournalEntry {
  _id: string;
  content: string; // Decrypted content for UI
  mood?: string;
  createdAt: string;
}

interface JournalState {
  journals: JournalEntry[];
  isLoading: boolean;
  fetchJournals: () => Promise<void>;
  createJournal: (text: string, mood?: string) => Promise<void>;
}

export const useJournalStore = create<JournalState>((set, get) => ({
  journals: [],
  isLoading: false,

  fetchJournals: async () => {
    set({ isLoading: true });
    try {
      const token = useAuthStore.getState().token;
      if (!token) return;

      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      const res = await api.get("/journals");

      const serverJournals = res.data.data;

      // Decrypt locally
      const decryptedJournals = await Promise.all(
        serverJournals.map(async (j: any) => {
          try {
            const decryptedText = await decryptDeviceSide(j.content);
            return { ...j, content: decryptedText };
          } catch {
            return { ...j, content: "Error decrypting entry" };
          }
        })
      );

      set({ journals: decryptedJournals });
    } catch (error) {
      console.error("Fetch Journals Error:", error);
    } finally {
      set({ isLoading: false });
    }
  },

  createJournal: async (text: string, mood?: string) => {
    set({ isLoading: true });
    try {
      const token = useAuthStore.getState().token;
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      // Encrypt locally
      const encryptedContent = await encryptDeviceSide(text);

      const res = await api.post("/journals", {
        encryptedContent,
        mood,
        tags: [], // Todo: Extract tags
      });

      // Optimistic update
      const newEntry = {
        _id: res.data.data._id,
        content: text,
        mood,
        createdAt: new Date().toISOString(),
      };

      set((state) => ({ journals: [newEntry, ...state.journals] }));
    } catch (error) {
      console.error("Create Journal Error:", error);
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },
}));
