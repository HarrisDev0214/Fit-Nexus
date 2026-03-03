import type { StringValue } from 'ms';

const requiredEnvVars = [
  'JWT_ACCESS_SECRET',
  'JWT_REFRESH_SECRET',
  'JWT_ISS',
  'JWT_ACCESS_EXPIRES_IN',
  'JWT_REFRESH_EXPIRES_IN'
] as const;

const missingVars = requiredEnvVars.filter((key) => !process.env[key]);

if (missingVars.length > 0) {
  throw new Error(
    `Missing required environment variables: ${missingVars.join(', ')}`
  );
}

export const jwtConfig = {
  accessSecret: process.env.JWT_ACCESS_SECRET as string,
  refreshSecret: process.env.JWT_REFRESH_SECRET as string,
  issuer: process.env.JWT_ISS as string,
  accessExpiresIn: process.env.JWT_ACCESS_EXPIRES_IN as StringValue,
  refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN as StringValue
} as const;
