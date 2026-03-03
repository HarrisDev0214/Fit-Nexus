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

  await authService.createEmailOtp(newUser.id, newUser.email);

  res.status(201).json({
    status: 'success',
    message: 'Email 驗證碼已發送',
    data: {
      email: newUser.email
    }
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

const logout = async (
  _req: Request,
  res: Response
) => {
  res.status(200).json({
    status: 'success'
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

const refreshToken = async (
  req: Request,
  res: Response
) => {
  const { userId, email } = req.user!;

  const accessToken = await authService.refreshToken({ userId, email });

  res.status(200).json({
    status: 'success',
    data: {
      accessToken
    }
  });
};

export {
  signUp,
  login,
  logout,
  updatePassword,
  refreshToken
};
