import { generateGeminiResponse } from "./ai/gemini";
import { generateGroqResponse } from "./ai/groq";
import { AIResponse } from "./ai/types";

// System prompt to define persona
const SYSTEM_CONTEXT = `You are MindMate, a supportive mental wellness companion.
You are empathetic, non-judgmental, and concise.
You are NOT a therapist. If a user expresses self-harm, gently suggest professional help.`;

export const getAIResponse = async (
  userId: string,
  message: string,
  history: any[]
): Promise<AIResponse> => {
  try {
    // 1. Try Gemini
    // Format history for Gemini
    const geminiHistory = history.map((msg) => ({
      role: msg.role === "user" ? "user" : "model",
      parts: msg.content,
    }));

    // Inject system context into first message if empty, or handle separately
    // For MVP/Gemini Pro, we prepend context to the latest message or assume model instruction
    const content = await generateGeminiResponse(
      geminiHistory,
      `${SYSTEM_CONTEXT}\nUser says: ${message}`
    );

    return { content, source: "gemini" };
  } catch (error) {
    console.warn("Gemini failed, switching to Groq:", error);

    try {
      // 2. Fallback to Groq
      const groqHistory = history.map((msg) => ({
        role: msg.role === "user" ? "user" : "assistant",
        content: msg.content,
      })); // @ts-ignore

      // Add system prompt to Groq messages
      const fullHistory = [
        { role: "system", content: SYSTEM_CONTEXT },
        ...groqHistory,
      ];

      // @ts-ignore
      const content = await generateGroqResponse(fullHistory, message);
      return { content, source: "groq" };
    } catch (groqError) {
      console.error("All AI services failed:", groqError);
      throw new Error("AI Service Unavailable");
    }
  }
};
