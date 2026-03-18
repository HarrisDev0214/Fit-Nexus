import argon2 from 'argon2';
import { randomBytes, randomInt } from 'crypto';
import { userRepository } from '@/repositories/user';
import { emailOtpRepository } from '@/repositories/emailOtp';
import { generateAccessToken, generateRefreshToken } from '@/utils/jwt';
import { hashToken } from '@/utils/crypto';
import type {
  SignupInput,
  LoginInput,
  UpdatePasswordInput,
  VerifyEmailOtpInput,
  VerifyPasswordResetOtpInput,
  ResetPasswordInput
} from '@/schemas/auth';
import {
  BadRequest400Error,
  NotFound404Error,
  Unauthorized401Error
} from '@/utils/errors';
import { emailService } from '@/services/email';
import { passwordResetTokenRepository } from '@/repositories/passwordResetToken';

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
      throw new Unauthorized401Error('Email or password is incorrect', 'INVALID_CREDENTIALS');
    }

    const passwordCheck = await argon2.verify(user.passwordHash, data.password);

    if (!passwordCheck) {
      throw new Unauthorized401Error('Email or password is incorrect', 'INVALID_CREDENTIALS');
    }

    if (!user.emailVerifiedAt) {
      throw new BadRequest400Error('Email not verified', 'EMAIL_NOT_VERIFIED');
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
      throw new Unauthorized401Error('Old password is incorrect', 'INVALID_OLD_PASSWORD');
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
  createEmailOtp: async (
    emailType: 'emailVerification' | 'passwordReset',
    userId: string,
    email: string
  ) => {
    const otp = randomInt(100000, 1000000).toString();
    await emailOtpRepository.upsert(userId, otp);

    try {
      switch (emailType) {
        case 'emailVerification':
          await emailService.sendEmailVerificationOtp(email, otp);
          break;
        case 'passwordReset':
          await emailService.sendPasswordResetOtp(email, otp);
          break;
      }
    } catch (err) {
      await emailOtpRepository.deleteByUserId(userId);
      throw err;
    }
  },
  recreateEmailOtp: async (email: string) => {
    const user = await userRepository.findByEmail(email);

    if (!user || user.emailVerifiedAt) {
      throw new BadRequest400Error('Unable to send verification email', 'OTP_SEND_FAILED');
    }
    const otpRecord = await emailOtpRepository.findByUserId(user.id);

    if (otpRecord) {
      const secondsOtpCreated = (Date.now() - otpRecord.createdAt.getTime());
      if (secondsOtpCreated < 60 * 1000) {
        throw new BadRequest400Error('Please wait before requesting a new OTP', 'OTP_RATE_LIMITED');
      }
    }

    await authService.createEmailOtp('emailVerification', user.id, email);
  },
  verifyEmailOtp: async (data: VerifyEmailOtpInput) => {
    const user = await userRepository.findByEmail(data.email);
    if (!user || user.emailVerifiedAt) {
      throw new BadRequest400Error('Invalid OTP code', 'OTP_INVALID');
    }

    const otpRecord = await emailOtpRepository.findByUserId(user.id);
    if (!otpRecord || otpRecord.expiresAt < new Date()) {
      throw new BadRequest400Error('Invalid OTP code', 'OTP_INVALID');
    }
    if (otpRecord.attempts >= 5) {
      throw new BadRequest400Error('Too many failed attempts', 'OTP_MAX_ATTEMPTS');
    }
    if (otpRecord.code !== data.otp) {
      await emailOtpRepository.incrementAttempts(user.id);
      throw new BadRequest400Error('Invalid OTP code', 'OTP_INVALID');
    }

    await emailOtpRepository.deleteByUserId(user.id);
    await userRepository.markEmailAsVerified(user.id);
  },
  createPasswordOtp: async (email: string) => {
    const user = await userRepository.findByEmail(email);

    if (user) {
      const otpRecord = await emailOtpRepository.findByUserId(user.id);

      if (otpRecord) {
        const secondsOtpCreated = (Date.now() - otpRecord.createdAt.getTime());
        if (secondsOtpCreated < 60 * 1000) {
          return;
        }
      }
      await authService.createEmailOtp('passwordReset', user.id, email);
    }
  },
  verifyPasswordResetOtp: async (data: VerifyPasswordResetOtpInput) => {
    const user = await userRepository.findByEmail(data.email);
    if (!user) {
      throw new BadRequest400Error('Invalid or expired OTP', 'OTP_INVALID');
    }

    const otpRecord = await emailOtpRepository.findByUserId(user.id);
    if (!otpRecord || otpRecord.expiresAt < new Date()) {
      throw new BadRequest400Error('Invalid or expired OTP', 'OTP_INVALID');
    }
    if (otpRecord.attempts >= 5) {
      throw new BadRequest400Error('Too many failed attempts', 'OTP_MAX_ATTEMPTS');
    }
    if (otpRecord.code !== data.otp) {
      await emailOtpRepository.incrementAttempts(user.id);
      throw new BadRequest400Error('Invalid or expired OTP', 'OTP_INVALID');
    }

    await emailOtpRepository.deleteByUserId(user.id);
    await passwordResetTokenRepository.deleteByUserId(user.id);

    const token = randomBytes(32).toString('hex');
    const tokenHash = hashToken(token);
    await passwordResetTokenRepository.create(tokenHash, user.id, data.email);

    return token;
  },
  resetPassword: async (data: ResetPasswordInput) => {
    const tokenHash = hashToken(data.resetToken);
    const tokenRecord = await passwordResetTokenRepository.findByTokenHash(tokenHash);
    if (!tokenRecord) {
      throw new BadRequest400Error('Reset token is invalid or expired, please request a new one', 'RESET_TOKEN_INVALID');
    }
    if (tokenRecord.expiresAt < new Date()) {
      await passwordResetTokenRepository.deleteByUserId(tokenRecord.userId);
      throw new BadRequest400Error('Reset token is invalid or expired, please request a new one', 'RESET_TOKEN_INVALID');
    }

    const newPasswordHash = await argon2.hash(data.newPassword);
    await userRepository.updatePassword(tokenRecord.userId, newPasswordHash);
    await passwordResetTokenRepository.deleteByUserId(tokenRecord.userId);

    try {
      await emailService.sendPasswordChanged(tokenRecord.email);
    } catch {
      // Email notification failure should not affect password reset success
    }
  }
};
