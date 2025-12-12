import { Request, Response, NextFunction } from 'express';
import MoodService from '../services/MoodService';

export const createMood = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      throw new Error('User context missing');
    }

    const { moodScore, moodTags, context } = req.body;

    const data = await MoodService.createMood({
      userId,
      moodScore,
      tags: moodTags,
      context,
    });

    res.status(201).json({
      success: true,
      data,
    });
  } catch (error) {
    next(error);
  }
};

export const getMoods = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      throw new Error('User context missing');
    }

    const { startDate, endDate } = req.query;

    const data = await MoodService.getUserMoods(
      userId,
      startDate ? new Date(startDate as string) : undefined,
      endDate ? new Date(endDate as string) : undefined
    );

    res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    next(error);
  }
};

export const getMoodSummary = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      throw new Error('User context missing');
    }

    const data = await MoodService.analyzePatterns(userId);

    res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    next(error);
  }
};
