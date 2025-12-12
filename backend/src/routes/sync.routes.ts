import { Router } from 'express';
import { z } from 'zod';
import * as SyncController from '../controllers/sync.controller';
import { authenticate } from '../middleware/auth.middleware';
import { validateRequest } from '../middleware/requestValidator';

const router = Router();

// Validation Schema
const syncOperationsSchema = z.object({
  body: z.object({
    operations: z
      .array(
        z
          .object({
            type: z.string(),
            data: z.unknown().optional(),
            id: z.string().optional(), // For updates/deletes
            clientId: z.string().optional(),
            enqueuedAt: z.iso.datetime().optional(),
          })
          .passthrough()
      )
      .min(1, { message: 'Operations array cannot be empty' }),
  }),
});

// Routes
router.post(
  '/',
  authenticate,
  validateRequest(syncOperationsSchema),
  SyncController.syncOperations
);

export default router;
