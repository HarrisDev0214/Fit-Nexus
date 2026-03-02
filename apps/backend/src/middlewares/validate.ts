import { type Response, type Request, type NextFunction } from 'express';
import { z } from 'zod';
import { Validation422Error } from '@/utils/errors';

export const validateInput = (schema: z.ZodType) => (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  try {
    schema.parse({ body: req.body });
    next();
  } catch (err) {
    if (err instanceof z.ZodError) {
      const errors = err.issues.map((issue) => ({
        field: issue.path.length > 1 ? issue.path.slice(1).join('.') : 'body',
        code: issue.code,
        message: issue.message
      }));

      return next(new Validation422Error('Input validation failed', errors));
    }

    next(err);
  }
};
