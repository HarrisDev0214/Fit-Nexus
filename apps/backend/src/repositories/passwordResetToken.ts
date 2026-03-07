import { db } from '@/db/db';
import { passwordResetTokens } from '@/db/schemas/passwordResetTokens';
import { eq } from 'drizzle-orm';

export const passwordResetTokenRepository = {
  create: async (token: string, userId: string, email: string) => {
    await db.insert(passwordResetTokens).values({
      userId: userId,
      token,
      email,
      expiresAt: new Date(Date.now() + 5 * 60 * 1000)
    });
  },
  deleteByUserId: async (userId: string) => {
    await db
      .delete(passwordResetTokens)
      .where(eq(passwordResetTokens.userId, userId));
  },
  findByToken: async (token: string) => {
    const [tokenRecord] = await db.select({
      userId: passwordResetTokens.userId,
      expiresAt: passwordResetTokens.expiresAt,
      email: passwordResetTokens.email
    })
      .from(passwordResetTokens)
      .where(eq(passwordResetTokens.token, token));

    return tokenRecord;
  }
};
