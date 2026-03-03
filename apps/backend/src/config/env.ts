const requiredEnvVars = [
  'JWT_ACCESS_SECRET',
  'JWT_REFRESH_SECRET',
  'JWT_ISS',
  'JWT_ACCESS_AUD',
  'JWT_REFRESH_AUD'
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
  accessAudience: process.env.JWT_ACCESS_AUD as string,
  refreshAudience: process.env.JWT_REFRESH_AUD as string
} as const;
