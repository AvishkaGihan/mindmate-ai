import { Request, Response, NextFunction } from 'express';
import { ZodType, ZodError } from 'zod';
import { AppError } from '../types';

export const validateRequest =
  (schema: ZodType) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      next();
    } catch (error: unknown) {
      if (error instanceof ZodError) {
        const details: Record<string, string> = {};
        error.issues.forEach((issue) => {
          const field = issue.path.join('.');
          details[field] = issue.message;
        });

        return next(
          new AppError(422, 'VALIDATION_ERROR', 'Invalid request data', details)
        );
      }
      next(error as Error);
    }
  };
