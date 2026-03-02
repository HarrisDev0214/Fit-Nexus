import jwt from 'jsonwebtoken';
import { Unauthorized401Error } from '@/utils/errors';
import type { Response, Request, NextFunction } from 'express';

const TOKEN_CONFIG = {
  access: {
    secret: process.env.JWT_ACCESS_SECRET!,
    audience: process.env.JWT_ACCESS_AUD,
    code: {
      missing: 'UNAUTHORIZED',
      expired: 'EXPIRED_ACCESS_TOKEN',
      invalid: 'INVALID_ACCESS_TOKEN'
    },
    message: {
      missing: 'Access token not provided',
      expired: 'Access token has expired',
      invalid: 'Access token is invalid'
    }
  },
  refresh: {
    secret: process.env.JWT_REFRESH_SECRET!,
    audience: process.env.JWT_REFRESH_AUD,
    code: {
      missing: 'UNAUTHORIZED',
      expired: 'EXPIRED_REFRESH_TOKEN',
      invalid: 'INVALID_REFRESH_TOKEN'
    },
    message: {
      missing: 'Refresh token not provided',
      expired: 'Refresh token has expired',
      invalid: 'Refresh token is invalid'
    }
  }
} as const;

export const validateJWT = (jwtType: 'access' | 'refresh') => {
  return async (
    req: Request,
    _res: Response,
    next: NextFunction
  ) => {
    const auth = req.headers.authorization || '';
    const token = auth.startsWith('Bearer ')
      ? auth.split(' ')[1]
      : null;

    if (!token) {
      throw new Unauthorized401Error(
        TOKEN_CONFIG[jwtType].code.missing,
        TOKEN_CONFIG[jwtType].message.missing
      );
    }

    try {
      const decodedJWT = jwt.verify(token, TOKEN_CONFIG[jwtType].secret, {
        algorithms: ['HS256'],
        issuer: process.env.JWT_ISS,
        audience: TOKEN_CONFIG[jwtType].audience
      }) as UserJwtPayload;

      req.user = decodedJWT;
      next();
    } catch (err) {
      if (err instanceof jwt.TokenExpiredError) {
        throw new Unauthorized401Error(
          TOKEN_CONFIG[jwtType].code.expired,
          TOKEN_CONFIG[jwtType].message.expired
        );
      }

      if (err instanceof jwt.JsonWebTokenError) {
        throw new Unauthorized401Error(
          TOKEN_CONFIG[jwtType].code.invalid,
          TOKEN_CONFIG[jwtType].message.invalid
        );
      }

      next(err);
    }
  };
};
