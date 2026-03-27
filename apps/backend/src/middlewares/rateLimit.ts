import { rateLimit } from 'express-rate-limit';

const rateLimitMessage = {
  status: 'error',
  code: 'RATE_LIMIT_EXCEEDED',
  message: 'Too many requests, please try again later'
};

const baseOptions = {
  standardHeaders: true,
  legacyHeaders: false,
  ipv6Subnet: 56,
  message: rateLimitMessage
};

export const generalLimiter = rateLimit({
  ...baseOptions,
  windowMs: 10 * 60 * 1000,
  limit: 100
});

export const authLimiter = rateLimit({
  ...baseOptions,
  windowMs: 5 * 60 * 1000,
  limit: 5
});

export const otpLimiter = rateLimit({
  ...baseOptions,
  windowMs: 60 * 1000,
  limit: 3
});
