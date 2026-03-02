import { type JwtPayload } from 'jsonwebtoken';

declare global {
  type UserJwtPayload = JwtPayload & {
    userId: string;
    email: string;
  };
}

export {};
