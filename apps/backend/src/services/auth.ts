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

type UserRepository = typeof userRepository;
type EmailOtpRepository = typeof emailOtpRepository;
type EmailService = typeof emailService;
type PasswordResetTokenRepository = typeof passwordResetTokenRepository;

class AuthService {
  constructor(
    private userRepository: UserRepository,
    private emailOtpRepository: EmailOtpRepository,
    private emailService: EmailService,
    private passwordResetTokenRepository: PasswordResetTokenRepository
  ) {}

  async signUp(data: SignupInput) {
    const passwordHash = await argon2.hash(data.password);
    const newUser = await this.userRepository.create({
      name: data.name,
      email: data.email,
      passwordHash,
      sex: data.sex
    });

    return newUser;
  }

  async login(data: LoginInput) {
    const user = await this.userRepository.findByEmail(data.email);
    if (!user) {
      throw new Unauthorized401Error('Email or password is incorrect', 'INVALID_CREDENTIALS');
    }
    if (!user.emailVerifiedAt) {
      throw new BadRequest400Error('Email not verified', 'EMAIL_NOT_VERIFIED');
    }

    const passwordCheck = await argon2.verify(user.passwordHash, data.password);
    if (!passwordCheck) {
      throw new Unauthorized401Error('Email or password is incorrect', 'INVALID_CREDENTIALS');
    }

    const payload = { userId: user.id, email: user.email };

    return {
      accessToken: generateAccessToken(payload),
      refreshToken: generateRefreshToken(payload)
    };
  }

  async updatePassword(data: UpdatePasswordInput & { userId: string }) {
    const user = await this.userRepository.findById(data.userId);
    if (!user) {
      throw new NotFound404Error('User not found');
    }

    const passwordCheck = await argon2.verify(user.passwordHash, data.oldPassword);
    if (!passwordCheck) {
      throw new Unauthorized401Error('Old password is incorrect', 'INVALID_OLD_PASSWORD');
    }

    const newPasswordHash = await argon2.hash(data.newPassword);
    await this.userRepository.updatePassword(data.userId, newPasswordHash);
  }

  async refreshToken(data: UserJwtData) {
    const user = await this.userRepository.findById(data.userId);
    if (!user) {
      throw new NotFound404Error('User not found');
    }

    return generateAccessToken({ userId: data.userId, email: data.email });
  }

  async createEmailOtp(
    emailType: 'emailVerification' | 'passwordReset',
    userId: string,
    email: string
  ) {
    const otp = randomInt(100000, 1000000).toString();
    await this.emailOtpRepository.upsert(userId, otp);

    try {
      switch (emailType) {
        case 'emailVerification':
          await this.emailService.sendEmailVerificationOtp(email, otp);
          break;
        case 'passwordReset':
          await this.emailService.sendPasswordResetOtp(email, otp);
          break;
      }
    } catch (err) {
      await this.emailOtpRepository.deleteByUserId(userId);
      throw err;
    }
  }

  async recreateEmailOtp(email: string) {
    const user = await this.userRepository.findByEmail(email);
    if (!user || user.emailVerifiedAt) {
      throw new BadRequest400Error('Unable to send verification email', 'OTP_SEND_FAILED');
    }

    const otpRecord = await this.emailOtpRepository.findByUserId(user.id);
    if (otpRecord) {
      const secondsOtpCreated = (Date.now() - otpRecord.createdAt.getTime());
      if (secondsOtpCreated < 60 * 1000) {
        throw new BadRequest400Error('Please wait before requesting a new OTP', 'OTP_RATE_LIMITED');
      }
    }

    await this.createEmailOtp('emailVerification', user.id, email);
  }

  async verifyEmailOtp(data: VerifyEmailOtpInput) {
    const user = await this.userRepository.findByEmail(data.email);
    if (!user || user.emailVerifiedAt) {
      throw new BadRequest400Error('Invalid OTP code', 'OTP_INVALID');
    }

    const otpRecord = await this.emailOtpRepository.findByUserId(user.id);
    if (!otpRecord || otpRecord.expiresAt < new Date()) {
      throw new BadRequest400Error('Invalid OTP code', 'OTP_INVALID');
    }
    if (otpRecord.attempts >= 5) {
      throw new BadRequest400Error('Too many failed attempts', 'OTP_MAX_ATTEMPTS');
    }
    if (otpRecord.code !== data.otp) {
      await this.emailOtpRepository.incrementAttempts(user.id);
      throw new BadRequest400Error('Invalid OTP code', 'OTP_INVALID');
    }

    await this.emailOtpRepository.deleteByUserId(user.id);
    await this.userRepository.markEmailAsVerified(user.id);
  }

  async createPasswordOtp(email: string) {
    const user = await this.userRepository.findByEmail(email);

    if (user) {
      const otpRecord = await this.emailOtpRepository.findByUserId(user.id);

      if (otpRecord) {
        const secondsOtpCreated = (Date.now() - otpRecord.createdAt.getTime());
        if (secondsOtpCreated < 60 * 1000) {
          return;
        }
      }
      await this.createEmailOtp('passwordReset', user.id, email);
    }
  }

  async verifyPasswordResetOtp(data: VerifyPasswordResetOtpInput) {
    const user = await this.userRepository.findByEmail(data.email);
    if (!user) {
      throw new BadRequest400Error('Invalid or expired OTP', 'OTP_INVALID');
    }

    const otpRecord = await this.emailOtpRepository.findByUserId(user.id);
    if (!otpRecord || otpRecord.expiresAt < new Date()) {
      throw new BadRequest400Error('Invalid or expired OTP', 'OTP_INVALID');
    }
    if (otpRecord.attempts >= 5) {
      throw new BadRequest400Error('Too many failed attempts', 'OTP_MAX_ATTEMPTS');
    }
    if (otpRecord.code !== data.otp) {
      await this.emailOtpRepository.incrementAttempts(user.id);
      throw new BadRequest400Error('Invalid or expired OTP', 'OTP_INVALID');
    }

    await this.emailOtpRepository.deleteByUserId(user.id);
    await this.passwordResetTokenRepository.deleteByUserId(user.id);

    const token = randomBytes(32).toString('hex');
    const tokenHash = hashToken(token);
    await this.passwordResetTokenRepository.create(tokenHash, user.id, data.email);

    return token;
  }

  async resetPassword(data: ResetPasswordInput) {
    const tokenHash = hashToken(data.resetToken);
    const tokenRecord = await this.passwordResetTokenRepository.findByTokenHash(tokenHash);
    if (!tokenRecord) {
      throw new BadRequest400Error('Reset token is invalid or expired, please request a new one', 'RESET_TOKEN_INVALID');
    }
    if (tokenRecord.expiresAt < new Date()) {
      await this.passwordResetTokenRepository.deleteByUserId(tokenRecord.userId);
      throw new BadRequest400Error('Reset token is invalid or expired, please request a new one', 'RESET_TOKEN_INVALID');
    }

    const newPasswordHash = await argon2.hash(data.newPassword);
    await this.userRepository.updatePassword(tokenRecord.userId, newPasswordHash);
    await this.passwordResetTokenRepository.deleteByUserId(tokenRecord.userId);

    try {
      await this.emailService.sendPasswordChanged(tokenRecord.email);
    } catch {
      // Email notification failure should not affect password reset success
    }
  }
}

export const authService = new AuthService(
  userRepository,
  emailOtpRepository,
  emailService,
  passwordResetTokenRepository
);
