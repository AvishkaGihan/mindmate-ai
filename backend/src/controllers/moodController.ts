import { Request, Response, NextFunction } from "express";
import User from "../models/User";
import { validate, moodSchema } from "../utils/validators";
import { AppError } from "../utils/AppError";
import { MoodState } from "../types";

/**
 * Mood Controller
 * Handles the logging and analysis of user mood data.
 * Since moods are embedded in the User document, operations are performed
 * on the User model directly.
 */
export class MoodController {
  /**
   * Log a new mood entry.
   * Adds the mood to the user's `moods` array.
   */
  public logMood = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      // 1. Validate Input
      const data = validate(moodSchema, req.body);

      // 2. Add to User Document
      // We use findOneAndUpdate for atomicity and to avoid fetching the whole user first
      const user = await User.findOneAndUpdate(
        { _id: req.user!.userId },
        {
          $push: {
            moods: {
              ...data,
              timestamp: data.timestamp || new Date(), // Use provided or current time
            },
          },
        },
        { new: true, runValidators: true }
      ).select("moods"); // Return only the moods array to save bandwidth

      if (!user) {
        throw new AppError("User not found", 404);
      }

      // 3. Return the last added mood
      const newMood = user.moods[user.moods.length - 1];

      res.status(201).json({
        status: "success",
        data: { mood: newMood },
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Get mood history.
   * Supports date range filtering via query params.
   * Default: Last 30 days.
   */
  public getHistory = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { startDate, endDate } = req.query;

      // Default to last 30 days if no range provided
      const end = endDate ? new Date(endDate as string) : new Date();
      const start = startDate ? new Date(startDate as string) : new Date();
      if (!startDate) start.setDate(end.getDate() - 30);

      // Aggregation Pipeline to filter embedded array
      const result = await User.aggregate([
        { $match: { _id: req.user!.userId } }, // Match User
        {
          $project: {
            moods: {
              $filter: {
                input: "$moods",
                as: "mood",
                cond: {
                  $and: [
                    { $gte: ["$$mood.timestamp", start] },
                    { $lte: ["$$mood.timestamp", end] },
                  ],
                },
              },
            },
          },
        },
      ]);

      const moods = result[0]?.moods || [];

      res.status(200).json({
        status: "success",
        results: moods.length,
        data: { moods },
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Get aggregated mood statistics for charts/insights.
   * Returns:
   * - Top moods (frequency)
   * - Average intensity
   * - Daily breakdown
   */
  public getStats = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { range = "7d" } = req.query;

      // Calculate date threshold
      const now = new Date();
      const threshold = new Date();
      if (range === "30d") threshold.setDate(now.getDate() - 30);
      else if (range === "90d") threshold.setDate(now.getDate() - 90);
      else threshold.setDate(now.getDate() - 7); // Default 7d

      const stats = await User.aggregate([
        { $match: { _id: req.user!.userId } },
        { $unwind: "$moods" },
        { $match: { "moods.timestamp": { $gte: threshold } } },
        {
          $group: {
            _id: null,
            averageIntensity: { $avg: "$moods.intensity" },
            totalEntries: { $sum: 1 },
            moodCounts: { $push: "$moods.mood" },
            // Group by day for timeline chart
            daily: {
              $push: {
                date: {
                  $dateToString: {
                    format: "%Y-%m-%d",
                    date: "$moods.timestamp",
                  },
                },
                mood: "$moods.mood",
                intensity: "$moods.intensity",
              },
            },
          },
        },
      ]);

      if (stats.length === 0) {
        res.status(200).json({
          status: "success",
          data: {
            averageIntensity: 0,
            totalEntries: 0,
            moodFrequency: {},
            daily: [],
          },
        });
        return;
      }

      // Process mood frequency client-side friendly format
      const rawCounts = stats[0].moodCounts;
      const moodFrequency: Record<string, number> = {};
      rawCounts.forEach((m: string) => {
        moodFrequency[m] = (moodFrequency[m] || 0) + 1;
      });

      res.status(200).json({
        status: "success",
        data: {
          averageIntensity: parseFloat(stats[0].averageIntensity.toFixed(1)),
          totalEntries: stats[0].totalEntries,
          moodFrequency,
          daily: stats[0].daily,
        },
      });
    } catch (error) {
      next(error);
    }
  };
}

export const moodController = new MoodController();
