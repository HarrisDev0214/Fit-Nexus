import pino from 'pino';
import { AppError } from '@/utils/errors';
import { DatabaseError } from 'pg';
import type { Request } from 'express';

const isTest = process.env.NODE_ENV === 'test';
const isDev = process.env.NODE_ENV !== 'production';

export const logger = isTest
  ? pino({ level: 'silent' })
  : isDev
    ? pino({ transport: { target: 'pino-pretty' } })
    : pino();

export const errorLogger = (
  err: AppError | DatabaseError | Error | unknown,
  req: Request
) => {
  const baseInfo = {
    url: req.url,
    method: req.method
  };
  if (err instanceof AppError) {
    logger.error({
      type: 'AppError',
      code: err.code,
      message: err.message,
      ...baseInfo,
      ...(isDev && { stack: err.stack })
    });
    return;
  }

  if (err instanceof DatabaseError) {
    logger.error({
      type: 'DatabaseError',
      code: err.code,
      ...baseInfo,
      ...(isDev && { stack: err.stack })
    });
    return;
  }

  if (err instanceof Error) {
    logger.error({
      ...baseInfo,
      type: 'UnknownError',
      message: err.message,
      ...(isDev && { stack: err.stack })
    });
    return;
  }

  logger.error({
    ...baseInfo,
    type: 'UnknownError',
    message: String(err)
  });
};
