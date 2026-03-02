import type { Request, Response } from 'express';
import { authService } from '@/services/auth';

const signUp = async (
  req: Request,
  res: Response
) => {
  const { name, email, password, sex } = req.body;
  const newUser = await authService.signUp({
    name,
    email,
    password,
    sex
  });

  res.status(201).json({
    status: 'success',
    data: newUser
  });
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

const updatePassword = async (
  req: Request,
  res: Response
) => {
  const { oldPassword, newPassword } = req.body;
  const { userId } = req.user!;

  await authService.updatePassword({ userId, oldPassword, newPassword });

  res.status(200).json({
    status: 'success'
  });
};

export {
  signUp,
  login,
  updatePassword
};
