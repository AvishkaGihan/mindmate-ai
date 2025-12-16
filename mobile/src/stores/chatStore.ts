import { create } from "zustand";
import { api } from "../services/api";

export interface ChatMessage {
  id: string;
  role: "user" | "model";
  content: string;
  isPending?: boolean; // For optimistic UI
}

interface ChatState {
  messages: ChatMessage[];
  isLoading: boolean;
  sendMessage: (text: string) => Promise<void>;
}

export const useChatStore = create<ChatState>((set, get) => ({
  messages: [],
  isLoading: false,

  sendMessage: async (text: string) => {
    const tempId = Date.now().toString();

    // 1. Optimistic Update (Show user message immediately)
    const userMsg: ChatMessage = { id: tempId, role: "user", content: text };
    const pendingAiMsg: ChatMessage = {
      id: tempId + "_ai",
      role: "model",
      content: "...",
      isPending: true,
    };

    set((state) => ({ messages: [...state.messages, userMsg, pendingAiMsg] }));

    try {
      // 2. API Call
      const res = await api.post("/chat", { message: text });

      // 3. Replace pending AI message with real response
      set((state) => ({
        messages: state.messages.map((m) =>
          m.id === tempId + "_ai"
            ? { ...m, content: res.data.data.message, isPending: false }
            : m
        ),
      }));
    } catch (error) {
      console.error("Chat message failed:", error);
      // Rollback on error (simplified)
      set((state) => ({
        messages: state.messages.filter(
          (m) => m.id !== tempId && m.id !== tempId + "_ai"
        ),
      }));
      alert("Failed to send message");
    }
  },
}));
