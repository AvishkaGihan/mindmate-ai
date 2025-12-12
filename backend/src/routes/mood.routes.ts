import { Router } from 'express';
import { z } from 'zod';
import * as MoodController from '../controllers/mood.controller';
import { authenticate } from '../middleware/auth.middleware';
import { validateRequest } from '../middleware/requestValidator';

const router = Router();

// Validation Schemas
const createMoodSchema = z.object({
  body: z.object({
    moodScore: z.number().min(1).max(5),
    moodTags: z.array(z.string()).optional(),
    context: z.record(z.string(), z.any()).optional(),
    timestamp: z.iso.datetime().optional(),
  }),
});

const getMoodsSchema = z.object({
  query: z.object({
    startDate: z.iso.datetime().optional(),
    endDate: z.iso.datetime().optional(),
    limit: z.string().regex(/^\d+$/).optional(),
    offset: z.string().regex(/^\d+$/).optional(),
  }),
});

const getMoodSummarySchema = z.object({
  query: z.object({
    period: z.enum(['7d', '30d']).optional(),
  }),
});

// Routes
router.post(
  '/',
  authenticate,
  validateRequest(createMoodSchema),
  MoodController.createMood
);

router.get(
  '/',
  authenticate,
  validateRequest(getMoodsSchema),
  MoodController.getMoods
);

router.get(
  '/summary',
  authenticate,
  validateRequest(getMoodSummarySchema),
  MoodController.getMoodSummary
);

export default router;
