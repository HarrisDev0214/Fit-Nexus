import argon2 from 'argon2';
import { randomInt } from 'crypto';
import { userRepository } from '@/repositories/user';
import { emailOtpRepository } from '@/repositories/emailOtp';
import { generateAccessToken, generateRefreshToken } from '@/utils/jwt';
import type { SignupInput, LoginInput, UpdatePasswordInput, VerifyEmailInput } from '@/schemas/auth';
import { BadRequest400Error, NotFound404Error, Unauthorized401Error } from '@/utils/errors';
import { emailService } from '@/services/email';

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

    if (!user.emailVerifiedAt) {
      throw new BadRequest400Error('請先完成信箱驗證');
    }

    const payload = { userId: user.id, email: user.email };

    return {
      accessToken: generateAccessToken(payload),
      refreshToken: generateRefreshToken(payload)
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

    return generateAccessToken({ userId: data.userId, email: data.email });
  },
  createEmailOtp: async (userId: string, email: string) => {
    await emailOtpRepository.deleteByUserId(userId);

    const otp = randomInt(100000, 1000000).toString();
    await emailOtpRepository.create(userId, otp);
    await emailService.sendEmailVerificationOtp(email, otp);
  },
  recreateEmailOtp: async (email: string) => {
    const user = await userRepository.findByEmail(email);

    if (!user) {
      throw new NotFound404Error('User not found');
    }

    if (user.emailVerifiedAt) {
      throw new BadRequest400Error('信箱已驗證');
    }
    const otpRecord = await emailOtpRepository.findByUserId(user.id);

    if (otpRecord) {
      const secondsOtpCreated = (Date.now() - otpRecord.createdAt.getTime());
      if (secondsOtpCreated < 60 * 1000) {
        throw new BadRequest400Error('請稍後再試');
      }
    }

    await authService.createEmailOtp(user.id, email);
  },
  verifyEmail: async (data: VerifyEmailInput) => {
    const user = await userRepository.findByEmail(data.email);

    if (!user) {
      throw new NotFound404Error('User not found');
    }

    if (user.emailVerifiedAt) {
      throw new BadRequest400Error('信箱已驗證');
    }

    const otpRecord = await emailOtpRepository.findByUserId(user.id);

    if (!otpRecord) {
      throw new NotFound404Error('OTP not found');
    }

    if (otpRecord.expiresAt < new Date()) {
      throw new BadRequest400Error('OTP 已過期');
    }

    if (otpRecord.attempts >= 5) {
      throw new BadRequest400Error('失敗次數過多，請重新發送驗證碼');
    }

    if (otpRecord.code !== data.otp) {
      await emailOtpRepository.incrementAttempts(user.id);
      throw new BadRequest400Error('OTP 驗證碼錯誤');
    }

    await emailOtpRepository.deleteByUserId(user.id);
    await userRepository.markEmailAsVerified(user.id);
  }
};
