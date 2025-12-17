import { Request, Response, NextFunction } from "express";
import Affirmation from "../models/Affirmation";
import User from "../models/User";
import { geminiService } from "../services/geminiService";
import { AppError } from "../utils/AppError";

/**
 * Affirmation Controller
 * Manages the generation and retrieval of daily affirmations.
 * Implements a "Cache-then-Generate" strategy to minimize AI costs.
 */
export class AffirmationController {
  /**
   * Get the daily affirmation.
   * 1. Checks if an affirmation has already been generated for the user today.
   * 2. If yes, return it (Cache hit).
   * 3. If no, analyze recent mood history, generate a new one via AI, save it, and return (Cache miss).
   */
  public getDailyAffirmation = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const userId = req.user!.userId;

      // 1. Check for existing affirmation created today
      const startOfDay = new Date();
      startOfDay.setHours(0, 0, 0, 0);

      const existingAffirmation = await Affirmation.findOne({
        userId,
        createdAt: { $gte: startOfDay },
      });

      if (existingAffirmation) {
        res.status(200).json({
          status: "success",
          data: { affirmation: existingAffirmation },
        });
        return;
      }

      // 2. Generate new affirmation
      // Fetch user's recent mood context (last 7 days) to make it personalized
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

      const user = await User.findById(userId).select("moods");

      if (!user) {
        throw new AppError("User not found", 404);
      }

      // Filter and format recent moods for the AI context
      const recentMoods = user.moods
        .filter((m) => m.timestamp >= sevenDaysAgo)
        .map((m) => `${m.mood} (Intensity: ${m.intensity})`)
        .join(", ");

      const context = recentMoods
        ? `User's recent moods: ${recentMoods}`
        : "User has no recent mood logs.";

      // Call AI Service
      const affirmationText = await geminiService.generateAffirmation(context);

      // 3. Save to Database (TTL index will handle cleanup later)
      const newAffirmation = await Affirmation.create({
        userId,
        text: affirmationText,
        theme: "daily-insight",
      });

      res.status(201).json({
        status: "success",
        data: { affirmation: newAffirmation },
      });
    } catch (error) {
      next(error);
    }
  };
}

export const affirmationController = new AffirmationController();
