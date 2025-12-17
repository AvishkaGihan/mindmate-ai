import { Request, Response, NextFunction } from "express";
import User from "../models/User";
import { geminiService } from "../services/geminiService";
import { validate, chatMessageSchema } from "../utils/validators";
import { AppError } from "../utils/AppError";
import { IConversationMessage } from "../types";

/**
 * Chat Controller
 * Manages the AI chat lifecycle:
 * 1. Validates user input.
 * 2. Retrieves conversation history (context) from the User document.
 * 3. Calls the AI Service (Gemini with Groq fallback).
 * 4. Persists the interaction to the database (User.conversationHistory).
 */
export class ChatController {
  /**
   * Handle a chat message.
   * This is a standard REST response for MVP (not streaming).
   * Streaming support can be added later via Server-Sent Events (SSE).
   */
  public sendMessage = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      // 1. Validate Input
      const { message, context } = validate(chatMessageSchema, req.body);
      const userId = req.user!.userId;

      // 2. Fetch User & History
      // We need the conversation history to give the AI "memory"
      const user = await User.findById(userId).select("conversationHistory");

      if (!user) {
        throw new AppError("User not found", 404);
      }

      // 3. Prepare History for AI
      // The User model already caps history at 50 items via validators,
      // but we might want to send only the last 10-20 to the AI to save tokens/cost.
      // We map the Mongoose subdocs to the interface expected by the service.
      const history: IConversationMessage[] = user.conversationHistory
        .slice(-20) // Take last 20 messages
        .map((msg) => ({
          role: msg.role as "user" | "model",
          content: msg.content,
          timestamp: msg.timestamp,
        }));

      // 4. Call AI Service
      // This step handles the fallback logic internally (Gemini -> Groq)
      const aiResponseText = await geminiService.generateChatResponse(
        message,
        history,
        context
      );

      // 5. Update Database (Persistence)
      // We push both the user's message and the AI's response
      const timestamp = new Date();

      user.conversationHistory.push({
        role: "user",
        content: message,
        timestamp,
      });

      user.conversationHistory.push({
        role: "model",
        content: aiResponseText,
        timestamp,
      });

      // If history exceeds limit (50), shift from the beginning
      // While the model validator prevents *saving* > 50, we should actively manage it here
      // to avoid validation errors.
      if (user.conversationHistory.length > 50) {
        const excess = user.conversationHistory.length - 50;
        user.conversationHistory.splice(0, excess);
      }

      await user.save();

      // 6. Send Response
      res.status(200).json({
        status: "success",
        data: {
          response: aiResponseText,
          saved: true,
        },
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Clear conversation history.
   * Useful if the user wants to start fresh or for privacy.
   */
  public clearHistory = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      await User.findByIdAndUpdate(req.user!.userId, {
        $set: { conversationHistory: [] },
      });

      res.status(200).json({
        status: "success",
        message: "Conversation history cleared",
      });
    } catch (error) {
      next(error);
    }
  };
}

export const chatController = new ChatController();
