import { Request, Response, NextFunction } from 'express';
import JournalService from '../services/JournalService';

export const createEntry = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      throw new Error('User context missing');
    }

    // content is expected to be a base64 string of the encrypted data
    const { content, moodScore, moodTags, metadata } = req.body;

    const data = await JournalService.createEntry({
      userId,
      contentEncrypted: content,
      metadata: metadata || { moodScore, tags: moodTags },
    });

    res.status(201).json({
      success: true,
      data,
    });
  } catch (error) {
    next(error);
  }
};

export const getEntries = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      throw new Error('User context missing');
    }

    const { page, limit, moodTags } = req.query;

    const filters = {
      page: page ? parseInt(page as string, 10) : 1,
      limit: limit ? parseInt(limit as string, 10) : 10,
      mood: undefined,
      tag: moodTags ? (moodTags as string) : undefined,
    };

    const data = await JournalService.getEntries(userId, filters);

    res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    next(error);
  }
};

export const getEntryById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      throw new Error('User context missing');
    }

    const { id } = req.params;
    const data = await JournalService.getEntryById(id, userId);

    res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    next(error);
  }
};

export const updateEntry = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      throw new Error('User context missing');
    }

    const { id } = req.params;
    const { content, metadata } = req.body;

    const data = await JournalService.updateEntry(id, userId, {
      contentEncrypted: content,
      metadata,
    });

    res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteEntry = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      throw new Error('User context missing');
    }

    const { id } = req.params;
    await JournalService.deleteEntry(id, userId);

    res.status(200).json({
      success: true,
      data: { message: 'Entry deleted successfully' },
    });
  } catch (error) {
    next(error);
  }
};
