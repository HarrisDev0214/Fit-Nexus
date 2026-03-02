import type { Request, Response, NextFunction } from 'express';
import { authService } from '@/services/auth';

const signUp = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { name, email, password, sex } = req.body;

  try {
    const newUser = await authService.signUp({
      name,
      email,
      password,
      sex
    });

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
