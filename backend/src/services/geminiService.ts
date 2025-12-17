import { config } from "../config/env";
import { IConversationMessage } from "../types";

/**
 * AI Service Layer (Gemini + Groq Fallback)
 * * Manages interactions with Large Language Models.
 * * Implements the Adapter Pattern to abstract the provider.
 * * Strategy:
 * 1. Attempt generation via Google Gemini (Flash 2.5) - Cost efficient & fast.
 * 2. On 429/503/Timeout, fallback to Groq (Llama 3.3) - High speed, high resilience.
 * * Note: Uses Node.js 18+ native 'fetch' to avoid unnecessary SDK bloat.
 */

interface AIMessage {
  role: "user" | "model" | "system" | "assistant";
  content: string;
}

const GEMINI_MODEL = "gemini-2.5-flash"; // Latest stable Gemini model (Dec 2025)
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;

const GROQ_MODEL = "llama-3.3-70b-versatile"; // Latest production Llama model from Groq
const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";

const SYSTEM_INSTRUCTION = `
You are MindMate, an empathetic and supportive mental wellness companion.
Your goal is to listen, validate feelings, and gently suggest grounding techniques.
- DO NOT provide clinical diagnoses or medical advice.
- IF a user expresses self-harm or severe crisis, gently urge them to seek professional help immediately.
- Keep responses concise (under 3-4 sentences) and conversational.
- Use a warm, non-judgmental tone.
`;

export class GeminiService {
  /**
   * Generates a chat response based on message and history.
   * Handles fallback logic automatically.
   */
  public async generateChatResponse(
    userMessage: string,
    history: IConversationMessage[],
    localContext?: string
  ): Promise<string> {
    try {
      return await this.callGeminiChat(userMessage, history, localContext);
    } catch (error) {
      console.warn(
        "⚠️ Gemini API failed, switching to Groq fallback:",
        (error as Error).message
      );

      if (config.ai.groqKey) {
        return await this.callGroqChat(userMessage, history, localContext);
      }

      console.error("❌ No fallback provider available.");
      throw new Error("AI Service unavailable. Please try again later.");
    }
  }

  /**
   * Generates a dynamic journaling prompt based on current text or sentiment.
   */
  public async generateJournalPrompt(currentText: string): Promise<string> {
    const prompt = `
      Analyze this journal fragment: "${currentText}".
      Generate a single, gentle, open-ended question to help the user explore this feeling deeper.
      Return ONLY the question.
    `;

    try {
      return await this.callGeminiSinglePrompt(prompt);
    } catch {
      // Fallback for simple prompts can be static if AI fails completely
      return "What is the main emotion you are feeling right now?";
    }
  }

  /**
   * Generates a daily affirmation based on recent mood context.
   */
  public async generateAffirmation(moodContext: string): Promise<string> {
    const prompt = `Based on this mood context: "${moodContext}", generate ONE complete, short, powerful positive affirmation. It must be under 20 words and end with a period. Return ONLY the affirmation text, nothing else.`;

    try {
      return await this.callGeminiSinglePrompt(prompt);
    } catch {
      return "I am capable of handling whatever this day brings.";
    }
  }

  // ============================================================================
  // Provider Implementations (Gemini)
  // ============================================================================

  private async callGeminiChat(
    userMessage: string,
    history: IConversationMessage[],
    context?: string
  ): Promise<string> {
    const contents = this.formatHistoryForGemini(userMessage, history, context);

    const response = await fetch(
      `${GEMINI_API_URL}?key=${config.ai.geminiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents,
          systemInstruction: { parts: [{ text: SYSTEM_INSTRUCTION }] },
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 250,
          },
        }),
      }
    );

    if (!response.ok) {
      throw new Error(
        `Gemini Error: ${response.status} ${response.statusText}`
      );
    }

    const data = (await response.json()) as any;

    // Safety check for empty responses or safety filters blocking content
    if (
      !data.candidates ||
      !data.candidates[0] ||
      !data.candidates[0].content
    ) {
      throw new Error(
        "Gemini returned empty response (possibly blocked by safety filters)."
      );
    }

    return data.candidates[0].content.parts[0].text;
  }

  private async callGeminiSinglePrompt(prompt: string): Promise<string> {
    const response = await fetch(
      `${GEMINI_API_URL}?key=${config.ai.geminiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ role: "user", parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.8,
            maxOutputTokens: 150,
          },
        }),
      }
    );

    if (!response.ok) throw new Error("Gemini Single Prompt Failed");

    const data = (await response.json()) as any;
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim();

    if (!text) {
      throw new Error("Gemini returned empty response");
    }

    return text;
  }

  // ============================================================================
  // Provider Implementations (Groq Fallback)
  // ============================================================================

  private async callGroqChat(
    userMessage: string,
    history: IConversationMessage[],
    context?: string
  ): Promise<string> {
    const messages = this.formatHistoryForGroq(userMessage, history, context);

    const response = await fetch(GROQ_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${config.ai.groqKey}`,
      },
      body: JSON.stringify({
        model: GROQ_MODEL,
        messages: messages,
        temperature: 0.7,
        max_tokens: 250,
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      throw new Error(`Groq Error: ${response.status} - ${err}`);
    }

    const data = (await response.json()) as any;
    return data.choices[0].message.content;
  }

  // ============================================================================
  // Formatters
  // ============================================================================

  /**
   * Formats history for Google Gemini API
   * Gemini expects: { role: 'user' | 'model', parts: [{ text: '...' }] }
   */
  private formatHistoryForGemini(
    newMessage: string,
    history: IConversationMessage[],
    context?: string
  ) {
    // 1. Map existing history
    const formatted = history.map((msg) => ({
      role: msg.role === "user" ? "user" : "model",
      parts: [{ text: msg.content }],
    }));

    // 2. Inject context into the *last* user message if present
    // or as a distinct system-like user prompt if history is empty
    let finalPrompt = newMessage;
    if (context) {
      finalPrompt = `[Context: ${context}] \n\n User: ${newMessage}`;
    }

    // 3. Append new message
    formatted.push({
      role: "user",
      parts: [{ text: finalPrompt }],
    });

    return formatted;
  }

  /**
   * Formats history for Groq (OpenAI Compatible)
   * Groq expects: { role: 'user'|'assistant'|'system', content: '...' }
   */
  private formatHistoryForGroq(
    newMessage: string,
    history: IConversationMessage[],
    context?: string
  ) {
    const messages: AIMessage[] = [
      { role: "system", content: SYSTEM_INSTRUCTION },
    ];

    history.forEach((msg) => {
      messages.push({
        role: msg.role === "user" ? "user" : "assistant", // Map 'model' -> 'assistant'
        content: msg.content,
      });
    });

    let finalContent = newMessage;
    if (context) {
      finalContent = `Context: ${context}\n\n${newMessage}`;
    }

    messages.push({ role: "user", content: finalContent });

    return messages;
  }
}

export const geminiService = new GeminiService();
