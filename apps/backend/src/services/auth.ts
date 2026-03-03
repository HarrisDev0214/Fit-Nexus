import argon2 from 'argon2';
import jwt from 'jsonwebtoken';
import { userRepository } from '@/repositories/user';
import { jwtConfig } from '@/config/env';
import type { SignupInput, LoginInput, UpdatePasswordInput } from '@/schemas/auth';
import { NotFound404Error, Unauthorized401Error } from '@/utils/errors';

export const authService = {
  signUp: async (data: SignupInput) => {
    const passwordHash = await argon2.hash(data.password);
    const newUser = await userRepository.create({
      name: data.name,
      email: data.email,
      passwordHash,
      sex: data.sex
    });

    return newUser;
  },
  login: async (data: LoginInput) => {
    const user = await userRepository.findByEmail(data.email);

    if (!user) {
      throw new Unauthorized401Error('Email or password is incorrect');
    }

    const passwordCheck = await argon2.verify(user.passwordHash, data.password);

    if (!passwordCheck) {
      throw new Unauthorized401Error('Email or password is incorrect');
    }

    const accessToken = jwt.sign(
      { userId: user.id, email: user.email },
      jwtConfig.accessSecret,
      {
        algorithm: 'HS256',
        expiresIn: '10m',
        issuer: jwtConfig.issuer,
        audience: jwtConfig.accessAudience
      }
    );

    const refreshToken = jwt.sign(
      { userId: user.id, email: user.email },
      jwtConfig.refreshSecret,
      {
        algorithm: 'HS256',
        expiresIn: '7d',
        issuer: jwtConfig.issuer,
        audience: jwtConfig.refreshAudience
      }
    );

    return {
      accessToken,
      refreshToken
    };
  },
  updatePassword: async (data: UpdatePasswordInput & { userId: string }) => {
    const user = await userRepository.findById(data.userId);

    if (!user) {
      throw new NotFound404Error('User not found');
    }

    const passwordCheck = await argon2.verify(user.passwordHash, data.oldPassword);

    if (!passwordCheck) {
      throw new Unauthorized401Error('Old password is incorrect');
    }

    const newPasswordHash = await argon2.hash(data.newPassword);
    await userRepository.updatePassword(data.userId, newPasswordHash);
  },
  refreshToken: async (data: UserJwtData) => {
    const user = await userRepository.findById(data.userId);

    if (!user) {
      throw new NotFound404Error('User not found');
    }

    const accessToken = jwt.sign(
      { userId: data.userId, email: data.email },
      jwtConfig.accessSecret,
      {
        algorithm: 'HS256',
        expiresIn: '10m',
        issuer: jwtConfig.issuer,
        audience: jwtConfig.accessAudience
      }
    );

    return accessToken;
  }
};
