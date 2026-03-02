import { eq } from 'drizzle-orm';
import { db } from '@/db/db';
import { users } from '@/db/schemas/users';
import type { SignupInput } from '@/schemas/auth';

type CreateUserData = Omit<SignupInput, 'password'> & {
  passwordHash: string;
};

export const userRepository = {
  create: async (data: CreateUserData) => {
    const [newUser] = await db.insert(users).values({
      name: data.name,
      email: data.email,
      passwordHash: data.passwordHash,
      sex: data.sex
    }).returning({
      id: users.id,
      name: users.name,
      email: users.email,
      sex: users.sex,
      createdAt: users.createdAt
    });

    return newUser;
  },
  findByEmail: async (email: string) => {
    const [user] = await db
      .select({ id: users.id, email: users.email, passwordHash: users.passwordHash })
      .from(users)
      .where(eq(users.email, email));

    return user;
  }
};
