import { Router } from 'express';
import { z } from 'zod';
import * as AuthController from '../controllers/auth.controller';
import { validateRequest } from '../middleware/requestValidator';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

// Validation Schemas
const signupSchema = z.object({
  body: z.object({
    email: z.string().email(),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    name: z.string().min(2, 'Name must be at least 2 characters'),
  }),
});

const loginSchema = z.object({
  body: z.object({
    email: z.string().email(),
    password: z.string().min(1, 'Password is required'),
  }),
});

// Routes
router.post('/signup', validateRequest(signupSchema), AuthController.signup);

router.post('/login', validateRequest(loginSchema), AuthController.login);

router.post('/logout', authenticate, AuthController.logout);

// Account deletion - mapped to users/:id to match API specification
// Note: Controller uses authenticated user ID from token for security
router.delete('/users/:id', authenticate, AuthController.deleteAccount);

export default router;
