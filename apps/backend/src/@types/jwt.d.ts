import { type JwtPayload } from 'jsonwebtoken';

declare global {
  type UserJwtData = {
    userId: string;
    email: string;
  };

  type UserJwtPayload = JwtPayload & UserJwtData;
}

export {};
