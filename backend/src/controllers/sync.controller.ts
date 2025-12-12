import { Request, Response, NextFunction } from 'express';
import SyncService from '../services/SyncService';

export const syncOperations = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      throw new Error('User context missing');
    }

    const { operations } = req.body;

    if (!Array.isArray(operations)) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Operations must be an array',
        },
      });
    }

    // Process the batch of operations via the SyncService
    // Returns results for individual operations and the new sync cursor
    const syncResult = await SyncService.syncOperations(userId, operations);

    // Return multi-status response as per Architecture patterns
    res.status(200).json({
      success: true,
      data: {
        processed: syncResult.processed,
        failed: syncResult.failed,
      },
    });
  } catch (error) {
    next(error);
  }
};
