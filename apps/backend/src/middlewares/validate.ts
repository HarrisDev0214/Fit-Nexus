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
      const errors = err.issues.map((issue) => {
        return {
          field: issue.path[1],
          code: issue.code,
          message: issue.message
        };
      });

      throw new Validation422Error('Input validation failed', errors);
    }

    next(err);
  }
};
