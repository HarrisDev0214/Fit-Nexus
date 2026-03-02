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
      status: 'success',
      message: 'User signed up successfully',
      data: newUser
    });
  } catch (err) {
    next(err);
  }
};

const login = async (
  req: Request,
  res: Response
) => {
  const { email, password } = req.body;
  const { accessToken, refreshToken } = await authService.login({ email, password });

  res.status(200).json({
    status: 'success',
    data: {
      accessToken,
      refreshToken
    }
  });
};

export {
  signUp,
  login
};
