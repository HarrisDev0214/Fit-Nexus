import type { Request, Response, NextFunction } from 'express';
import argon2 from 'argon2';
import { db } from '@/db/db';
import { users } from '@/db/schemas/users';

const signUp = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { name, email, password, sex } = req.body;

  try {
    const passwordHash = await argon2.hash(password);
    const [newUser] = await db.insert(users).values({
      name,
      email,
      passwordHash,
      sex
    }).returning();

    res.status(201).json({
      message: 'User signed up successfully',
      data: newUser
    });
  } catch (err) {
    next(err);
  }
};

export {
  signUp
};
