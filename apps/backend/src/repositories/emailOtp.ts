import { db } from '@/db/db';
import { emailOtps } from '@/db/schemas/emailOtps';
import { eq } from 'drizzle-orm';

export const emailOtpRepository = {
  create: async (userId: string, otp: string) => {
    await db.insert(emailOtps).values({
      userId,
      code: otp,
      attempts: 0,
      expiresAt: new Date(Date.now() + 5 * 60 * 1000)
    });
  },
  deleteByUserId: async (userId: string) => {
    await db
      .delete(emailOtps)
      .where(eq(emailOtps.userId, userId));
  }
};
