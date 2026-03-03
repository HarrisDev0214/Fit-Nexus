import jwt from 'jsonwebtoken';
import { jwtConfig } from '@/config/env';

export const generateAccessToken = (payload: UserJwtData): string => {
  return jwt.sign(payload, jwtConfig.accessSecret, {
    algorithm: 'HS256',
    expiresIn: jwtConfig.accessExpiresIn,
    issuer: jwtConfig.issuer
  });
};

export const generateRefreshToken = (payload: UserJwtData): string => {
  return jwt.sign(payload, jwtConfig.refreshSecret, {
    algorithm: 'HS256',
    expiresIn: jwtConfig.refreshExpiresIn,
    issuer: jwtConfig.issuer
  });
};
