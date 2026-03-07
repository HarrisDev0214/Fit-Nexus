import { db } from '@/db/db';
import { emailOtps } from '@/db/schemas/emailOtps';
import { eq, sql } from 'drizzle-orm';

export const emailOtpRepository = {
  upsert: async (userId: string, otp: string) => {
    await db.insert(emailOtps).values({
      userId,
      code: otp,
      attempts: 0,
      expiresAt: new Date(Date.now() + 5 * 60 * 1000)
    }).onConflictDoUpdate({
      target: emailOtps.userId,
      set: {
        code: otp,
        attempts: 0,
        expiresAt: new Date(Date.now() + 5 * 60 * 1000),
        createdAt: new Date()
      }
    });
  },
  deleteByUserId: async (userId: string) => {
    await db
      .delete(emailOtps)
      .where(eq(emailOtps.userId, userId));
  },
  findByUserId: async (userId: string) => {
    const [otpRecord] = await db
      .select({
        code: emailOtps.code,
        expiresAt: emailOtps.expiresAt,
        attempts: emailOtps.attempts,
        createdAt: emailOtps.createdAt
      })
      .from(emailOtps)
      .where(eq(emailOtps.userId, userId));

    return otpRecord;
  },
  incrementAttempts: async (userId: string): Promise<void> => {
    await db
      .update(emailOtps)
      .set({ attempts: sql`${emailOtps.attempts} + 1` })
      .where(eq(emailOtps.userId, userId));
  }
};
