import api from "./api";
import { ChatMessage } from "../types";

/**
 * Gemini AI Client Service
 * Manages interactions with the AI Chatbot and Prompt Generation features.
 * * NOTE: For the MVP architecture, this service primarily acts as a facade
 * that formats data before sending it to the Node.js backend. The backend
 * holds the actual API keys and handles the direct communication with Google Gemini
 * to ensure security (avoiding leaking keys in the client bundle).
 */

export interface AIResponse {
  role: "model";
  content: string;
  isError?: boolean;
}

export const geminiClient = {
  /**
   * Sends a message to the AI Chatbot.
   * Includes conversation history to maintain context.
   * * @param history - Array of previous messages (excluding the current new one)
   * @param message - The new user message string
   * @returns Promise resolving to the AI's response content
   */
  sendMessage: async (
    history: ChatMessage[],
    message: string
  ): Promise<AIResponse> => {
    try {
      // Format history for backend consumption if needed, or send as is.
      // The backend expects: { message: string, history: ChatMessage[] }
      const payload = {
        message,
        history: history.map((msg) => ({
          role: msg.role,
          content: msg.content,
        })),
      };

      const response = await api.post("/chat", payload);

      return {
        role: "model",
        content: response.data.reply || response.data.data, // Handle variable response structures
      };
    } catch (error) {
      console.error("[GeminiClient] Send message failed", error);

      // Return a graceful error message to the UI instead of crashing
      return {
        role: "model",
        content:
          "I'm having trouble connecting right now. Please try again in a moment.",
        isError: true,
      };
    }
  },

  /**
   * Generates a dynamic journaling prompt based on current text sentiment.
   * * @param journalContent - The text the user has written so far
   * @returns Promise resolving to a suggested prompt string
   */
  generateJournalPrompt: async (
    journalContent: string
  ): Promise<string | null> => {
    if (!journalContent || journalContent.length < 10) return null;

    try {
      const response = await api.post("/chat/prompt", {
        context: journalContent,
      });
      return response.data.prompt;
    } catch (error) {
      // Fail silently for prompts - they are enhancements, not critical features
      console.warn("[GeminiClient] Prompt generation failed", error);
      return null;
    }
  },

  /**
   * Fetches a personalized daily affirmation.
   * Uses the user's recent mood history (handled by backend logic).
   */
  getDailyAffirmation: async (): Promise<string> => {
    try {
      const response = await api.get("/affirmations/today");
      return response.data.text;
    } catch (error) {
      console.error("[GeminiClient] Affirmation fetch failed", error);
      // Fallback affirmation if API fails
      return "You are doing your best, and that is enough.";
    }
  },
};
