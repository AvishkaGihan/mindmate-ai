import { create } from "zustand";
import { ChatMessage } from "../types";
import { geminiClient } from "../services/geminiClient";
import { storage } from "../services/storage";

/**
 * Chat Store
 * Manages the ephemeral state of the AI conversation.
 * Handles message history, typing status, and basic persistence.
 */

interface ChatState {
  messages: ChatMessage[];
  isTyping: boolean;
  error: string | null;
  sendMessage: (text: string) => Promise<void>;
  clearHistory: () => void;
  loadHistory: () => Promise<void>;
}

const STORAGE_KEY = "mindmate_chat_history";

export const useChatStore = create<ChatState>((set, get) => ({
  messages: [],
  isTyping: false,
  error: null,

  /**
   * Sends a user message to the AI and handles the response.
   */
  sendMessage: async (text: string) => {
    if (!text.trim()) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
      content: text,
      timestamp: new Date().toISOString(),
    };

    // 1. Update UI immediately with user message
    const previousMessages = get().messages;
    set({
      messages: [...previousMessages, userMsg],
      isTyping: true,
      error: null,
    });

    try {
      // 2. Call AI Service (passing history for context)
      const response = await geminiClient.sendMessage(previousMessages, text);

      const aiMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: "model",
        content: response.content,
        timestamp: new Date().toISOString(),
        isError: response.isError,
      };

      // 3. Update UI with AI response
      const newHistory = [...get().messages, aiMsg];
      set({
        messages: newHistory,
        isTyping: false,
      });

      // 4. Persist locally
      storage.setItem(STORAGE_KEY, newHistory);
    } catch (err) {
      console.error("[ChatStore] Send failed", err);
      set({
        isTyping: false,
        error: "Failed to connect. Please check your internet and try again.",
      });
    }
  },

  /**
   * Clears conversation history from state and storage.
   */
  clearHistory: () => {
    set({ messages: [] });
    storage.removeItem(STORAGE_KEY);
  },

  /**
   * Loads previous conversation from local storage on mount.
   */
  loadHistory: async () => {
    const history = await storage.getItem<ChatMessage[]>(STORAGE_KEY);
    if (history) {
      set({ messages: history });
    }
  },
}));
