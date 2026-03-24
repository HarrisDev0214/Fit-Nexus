import { rateLimit } from 'express-rate-limit';

const rateLimitMessage = {
  status: 'error',
  code: 'RATE_LIMIT_EXCEEDED',
  message: 'Too many requests, please try again later'
};

export const generalLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  limit: 100,
  standardHeaders: true,
  legacyHeaders: false,
  ipv6Subnet: 56,
  message: rateLimitMessage
});

export const authLimiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  limit: 5,
  message: rateLimitMessage
});

export const otpLimiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 3,
  message: rateLimitMessage
});
