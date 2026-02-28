
import type { Request, Response, NextFunction } from 'express';
import { logger, errorLogger } from '@/utils/logger';
import { DatabaseError } from 'pg';
import { AppError } from '@/utils/errors';

type BodyParserError = SyntaxError & {
  status: number;
  body: string;
};

export const jsonErrorHandler = (
  err: unknown,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof SyntaxError && 'body' in err) {
    const bodyParseError = err as BodyParserError;

    logger.error({
      statusCode: bodyParseError.status,
      message: bodyParseError.message,
      url: req.url,
      method: req.method,
      rawBody: err.body,
      headers: req.headers
    });

    return res.status(400).json({
      status: 'error',
      code: 'INVALID_JSON',
      message: 'Invalid JSON format'
    });
  }
  next(err);
};

export const globalErrorHandler = (
  err: unknown,
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  if (err instanceof Error && err.cause instanceof DatabaseError) {
    return pgErrorHandler(err.cause, req, res);
  }

  if (err instanceof AppError) {
    errorLogger(err, req);
    return res.status(err.statusCode).json({
      status: 'error',
      code: err.code,
      message: err.message
    });
  }

  if (err instanceof Error) {
    errorLogger(err, req);
    return res.status(500).json({
      status: 'error',
      code: 'INTERNAL_SERVER_ERROR',
      message: err.message,
      ...(process.env.NODE_ENV === 'development' && {
        stack: err.stack
      })
    });
  }

  errorLogger(err, req);
  return res.status(500).json({
    status: 'error',
    code: 'INTERNAL_SERVER_ERROR',
    message: 'An unexpected error occurred'
  });
};

const pgErrorHandler = (
  dbError: DatabaseError,
  req: Request,
  res: Response
) => {
  errorLogger(dbError, req);

  if (dbError.code === '23505') {
    const field = dbError.detail?.match(/Key \((\w+)\)/)?.[1] || 'field';

    return res.status(409).json({
      status: 'error',
      code: 'DUPLICATE_VALUE',
      message: `${field} already exists`
    });
  }

  return res.status(503).json({
    status: 'error',
    code: 'DATABASE_ERROR',
    message: 'A database error occurred'
  });
};
