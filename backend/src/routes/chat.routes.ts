import { Router } from 'express';
import { z } from 'zod';
import * as ChatController from '../controllers/chat.controller';
import { authenticate } from '../middleware/auth.middleware';
import { validateRequest } from '../middleware/requestValidator';

const router = Router();

// Validation Schemas
const sendMessageSchema = z.object({
  body: z.object({
    message: z.string().min(1, 'Message cannot be empty'),
  }),
});

// Routes
router.post(
  '/',
  authenticate,
  validateRequest(sendMessageSchema),
  ChatController.sendMessage
);

router.get('/', authenticate, ChatController.getHistory);

export default router;
