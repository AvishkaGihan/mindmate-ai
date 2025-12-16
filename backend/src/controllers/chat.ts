import { Request, Response } from "express";
import User from "../models/User";
import { getAIResponse } from "../services/aiService";

export const chatWithAI = async (req: Request, res: Response) => {
  try {
    // @ts-ignore
    const userId = req.user.uid;
    const { message } = req.body;

    if (!message) {
      res.status(400).json({ message: "Message required" });
      return;
    }

    const user = await User.findOne({ uid: userId });
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    // 1. Get History (Limit last 20 for context window efficiency)
    const history = user.get("conversationHistory") || []; // Use .get() to access untyped path if interface not updated
    const recentHistory = history.slice(-20);

    // 2. Get AI Response
    const aiResponse = await getAIResponse(userId, message, recentHistory);

    // 3. Update History (Atomic push + slice to keep max 50)
    await User.findOneAndUpdate(
      { uid: userId },
      {
        $push: {
          conversationHistory: {
            $each: [
              { role: "user", content: message, timestamp: new Date() },
              {
                role: "model",
                content: aiResponse.content,
                timestamp: new Date(),
              },
            ],
            $slice: -50, // Keep only last 50
          },
        },
      }
    );

    res.status(200).json({
      status: "success",
      data: {
        message: aiResponse.content,
        source: aiResponse.source,
      },
    });
  } catch (error) {
    console.error("Chat Error:", error);
    res.status(500).json({ message: "Failed to process chat" });
  }
};
