import { Router } from 'express';
import { z } from 'zod';
import * as JournalController from '../controllers/journal.controller';
import { authenticate } from '../middleware/auth.middleware';
import { validateRequest } from '../middleware/requestValidator';

const router = Router();

// Validation Schemas
const createEntrySchema = z.object({
  body: z.object({
    content: z.string().min(1, { message: 'Encrypted content is required' }),
    moodScore: z.number().min(1).max(5).optional(),
    moodTags: z.array(z.string()).optional(),
    timestamp: z.iso.datetime().optional(),
    metadata: z.record(z.string(), z.unknown()).optional(),
  }),
});

const getEntriesSchema = z.object({
  query: z.object({
    page: z.string().regex(/^\d+$/).optional(),
    limit: z.string().regex(/^\d+$/).optional(),
    startDate: z.iso.datetime().optional(),
    endDate: z.iso.datetime().optional(),
    moodTags: z.string().optional(), // Comma-separated string in query
  }),
});

const updateEntrySchema = z.object({
  params: z.object({
    id: z.uuid().or(z.string().min(1)), // UUID preferred, but flexible for ID strategy
  }),
  body: z.object({
    content: z.string().optional(),
    metadata: z.record(z.string(), z.unknown()).optional(),
  }),
});

const entryIdSchema = z.object({
  params: z.object({
    id: z.string().min(1),
  }),
});

// Routes
router.post(
  '/',
  authenticate,
  validateRequest(createEntrySchema),
  JournalController.createEntry
);

router.get(
  '/',
  authenticate,
  validateRequest(getEntriesSchema),
  JournalController.getEntries
);

router.get(
  '/:id',
  authenticate,
  validateRequest(entryIdSchema),
  JournalController.getEntryById
);

router.put(
  '/:id',
  authenticate,
  validateRequest(updateEntrySchema),
  JournalController.updateEntry
);

router.delete(
  '/:id',
  authenticate,
  validateRequest(entryIdSchema),
  JournalController.deleteEntry
);

export default router;
