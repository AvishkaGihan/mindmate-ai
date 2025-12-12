import axios from 'axios';
import conversationRepository from '../repositories/ConversationRepository';
import moodService from './MoodService';
import journalService from './JournalService'; // Used for metadata context only
import { config } from '../config/env';
import { ChatMessage, Conversation } from '../types';

interface GeminiPayload {
  contents: Array<{
    role: 'user' | 'model';
    parts: Array<{
      text: string;
    }>;
  }>;
  generationConfig: {
    temperature: number;
    maxOutputTokens: number;
  };
}

class ChatService {
  private readonly GEMINI_API_URL =
    'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';

  /**
   * Process a user message and generate an AI response
   */
  async sendMessage(
    userId: string,
    messageContent: string,
    conversationId?: string
  ): Promise<{ conversation: Conversation; response: ChatMessage }> {
    // 1. Retrieve or create conversation context
    let conversation = conversationId
      ? await conversationRepository.findByUserId(userId) // MVP: Single active convo per user
      : null;

    if (!conversation) {
      conversation = await conversationRepository.create({
        userId,
        messages: [],
      });
    }

    // 2. Build privacy-safe context (Mood trends, journal metadata - NO raw journal text)
    const systemContext = await this.buildSystemContext(userId);

    // 3. Construct the prompt for Gemini
    const userMessage: ChatMessage = {
      role: 'user',
      content: messageContent,
      timestamp: new Date().toISOString(),
    };

    const promptPayload = this.constructGeminiPayload(
      systemContext,
      conversation.messages,
      userMessage
    );

    // 4. Call Gemini API
    let aiResponseContent =
      "I'm having trouble connecting right now, but I'm here for you. Please try again in a moment.";

    try {
      const apiResponse = await axios.post(
        `${this.GEMINI_API_URL}?key=${config.geminiApiKey}`,
        promptPayload
      );

      const candidate = apiResponse.data?.candidates?.[0];
      if (candidate?.content?.parts?.[0]?.text) {
        aiResponseContent = candidate.content.parts[0].text;
      }
    } catch (error) {
      console.error('Gemini API Error:', error);
      // Fallback response remains
    }

    const aiMessage: ChatMessage = {
      role: 'assistant',
      content: aiResponseContent,
      timestamp: new Date().toISOString(),
    };

    // 5. Persist the new messages to the database
    const updatedConversation = await conversationRepository.updateMessages(
      conversation.id,
      [userMessage, aiMessage]
    );

    if (!updatedConversation) {
      throw new Error('Failed to update conversation history');
    }

    return {
      conversation: updatedConversation,
      response: aiMessage,
    };
  }

  /**
   * Aggregates recent mood and journal metadata to provide context without exposing private content.
   */
  private async buildSystemContext(userId: string): Promise<string> {
    const today = new Date();
    const sevenDaysAgo = new Date(today);
    sevenDaysAgo.setDate(today.getDate() - 7);

    // Fetch mood patterns
    const recentMoods = await moodService.getUserMoods(
      userId,
      sevenDaysAgo,
      today
    );
    const moodAvg =
      recentMoods.length > 0
        ? (
            recentMoods.reduce((acc, curr) => acc + curr.moodScore, 0) /
            recentMoods.length
          ).toFixed(1)
        : 'Unknown';

    // Extract recent mood tags (privacy safe)
    const recentTags = Array.from(
      new Set(recentMoods.flatMap((m) => m.tags || []))
    ).join(', ');

    // Fetch journal metadata (NOT content)
    const journalData = await journalService.getEntries(userId, { limit: 5 });
    const journalCount = journalData.total;

    return `
  You are MindMate AI, a supportive, empathetic, and non-judgmental mental wellness companion.

  User Context (Last 7 Days):
  - Average Mood Score: ${moodAvg}/5
  - Recent Feelings/Tags: ${recentTags || 'None logged'}
  - Journaling Activity: ${journalCount} recent entries (Metadata only)

  Guidelines:
  1. Be warm, concise, and grounding.
  2. Validate the user's feelings.
  3. Do NOT give medical advice or diagnosis.
  4. Reference their mood context if relevant (e.g., "I see you've been feeling ${recentTags} lately...").
  5. Keep responses under 3-4 sentences unless deep processing is needed.
  6. If the user seems in crisis, suggest professional help gently.
`.trim();
  }

  /**
   * Formats the request for Google Gemini API
   */
  private constructGeminiPayload(
    systemInstruction: string,
    history: ChatMessage[],
    newMessage: ChatMessage
  ): GeminiPayload {
    // Gemini Pro is stateless via REST, but we can structure the prompt to include history.
    // For this implementation, we simply append history to the prompt text or use the 'contents' array structure.

    const contents: GeminiPayload['contents'] = [];

    // 1. Add System Instruction as the first "user" message (prompt engineering technique for models without explicit system role in API)
    contents.push({
      role: 'user',
      parts: [{ text: systemInstruction }],
    });

    contents.push({
      role: 'model',
      parts: [
        { text: 'Understood. I am ready to support the user as MindMate AI.' },
      ],
    });

    // 2. Add Recent History (Limit to last 10 messages to manage context window)
    const recentHistory = history.slice(-10);
    recentHistory.forEach((msg) => {
      contents.push({
        role: msg.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: msg.content }],
      });
    });

    // 3. Add Current Message
    contents.push({
      role: 'user',
      parts: [{ text: newMessage.content }],
    });

    return {
      contents,
      generationConfig: {
        temperature: 0.7, // Balanced creativity and empathy
        maxOutputTokens: 300,
      },
    };
  }
}

export default new ChatService();
