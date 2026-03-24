import type { Request, Response } from 'express';
import { authService } from '@/services/auth';

/**
 * @openapi
 * /api/v1/auth/signup:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Sign up a new user
 *     description: Create a new user account
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/auth/signupSchema/request'
 *     responses:
 *       201:
 *         description: User created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/auth/signupSchema/response'
 *       409:
 *         description: "`EMAIL_EXISTS` : Email already exists"
 */
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
  await authService.createEmailOtp('emailVerification', newUser.id, newUser.email);

  res.status(201).json({
    status: 'success',
    message: 'Verification email sent',
    data: {
      email: newUser.email
    }
  });
};

/**
 * @openapi
 * /api/v1/auth/login:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Login account
 *     description: Login with email and password
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/auth/loginSchema/request'
 *     responses:
 *       200:
 *         description: Login successfully
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/auth/loginSchema/response'
 *       400:
 *         description: "`EMAIL_NOT_VERIFIED` : Email not verified"
 *       401:
 *         description: "`INVALID_CREDENTIALS` : Email or password is incorrect"
 */
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

/**
 * @openapi
 * /api/v1/auth/logout:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Logout user
 *     description: Logout the current user session
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Logout successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/auth/logoutSchema/response'
 */
const logout = async (
  _req: Request,
  res: Response
) => {
  res.status(200).json({
    status: 'success'
  });
};

/**
 * @openapi
 * /api/v1/auth/password:
 *   patch:
 *     tags:
 *       - Auth
 *     summary: Update password
 *     description: Update the current user's password
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/auth/updatePasswordSchema/request'
 *     responses:
 *       200:
 *         description: Password updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/auth/updatePasswordSchema/response'
 *       401:
 *         description: "`INVALID_OLD_PASSWORD` : Old password is incorrect"
 */
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

/**
 * @openapi
 * /api/v1/auth/token/refresh:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Refresh access token
 *     description: Get a new access token using a valid refresh token
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Token refreshed successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/auth/refreshTokenSchema/response'
 */
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

/**
 * @openapi
 * /api/v1/auth/email/verify:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Verify email with OTP
 *     description: Verify user email using the OTP code sent to their email
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/auth/verifyEmailOtpSchema/request'
 *     responses:
 *       200:
 *         description: Email verified successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/auth/verifyEmailOtpSchema/response'
 *       400:
 *         description: |
 *           - `OTP_MAX_ATTEMPTS` : Too many failed attempts
 *           - `OTP_INVALID` : Invalid OTP code
 */
const verifyEmailOtp = async (
  req: Request,
  res: Response
) => {
  const { otp, email } = req.body;
  await authService.verifyEmailOtp({ otp, email });

  res.status(200).json({
    status: 'success',
    message: 'Email verified successfully'
  });
};

/**
 * @openapi
 * /api/v1/auth/email/otp:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Resend email verification OTP
 *     description: Request a new OTP code for email verification
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/auth/recreateEmailOtpSchema/request'
 *     responses:
 *       200:
 *         description: OTP sent successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/auth/recreateEmailOtpSchema/response'
 *       400:
 *         description: |
 *           - `OTP_SEND_FAILED` : Unable to send verification email
 *           - `OTP_RATE_LIMITED` : Please wait before requesting a new OTP
 */
const recreateEmailOtp = async (
  req: Request,
  res: Response
) => {
  const { email } = req.body;
  await authService.recreateEmailOtp(email);

  res.status(200).json({
    status: 'success',
    message: 'Verification email sent'
  });
};

/**
 * @openapi
 * /api/v1/auth/password/otp:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Request password reset OTP
 *     description: Request an OTP code to reset password. For security reasons, always returns success regardless of whether the email exists.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/auth/createPasswordResetOtpSchema/request'
 *     responses:
 *       200:
 *         description: Request processed successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/auth/createPasswordResetOtpSchema/response'
 */
const createPasswordResetOtp = async (
  req: Request,
  res: Response
) => {
  const { email } = req.body;
  await authService.createPasswordOtp(email);

  res.status(200).json({
    status: 'success',
    message: 'If this email is registered, you will receive a verification code'
  });
};

/**
 * @openapi
 * /api/v1/auth/password/verify:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Verify password reset OTP
 *     description: Verify the OTP code for password reset and receive a reset token
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/auth/verifyPasswordResetOtpSchema/request'
 *     responses:
 *       200:
 *         description: OTP verified successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/auth/verifyPasswordResetOtpSchema/response'
 *       400:
 *         description: |
 *           - `OTP_INVALID` : Invalid or expired OTP
 *           - `OTP_MAX_ATTEMPTS` : Too many failed attempts
 */
const verifyPasswordResetOtp = async (
  req: Request,
  res: Response
) => {
  const { otp, email } = req.body;
  const resetToken = await authService.verifyPasswordResetOtp({ otp, email });

  res.status(200).json({
    status: 'success',
    data: {
      resetToken
    }
  });
};

/**
 * @openapi
 * /api/v1/auth/password/reset:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Reset password
 *     description: Reset password using the reset token obtained from password/verify endpoint
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/auth/resetPasswordSchema/request'
 *     responses:
 *       200:
 *         description: Password reset successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/auth/resetPasswordSchema/response'
 *       400:
 *         description: "`RESET_TOKEN_INVALID` : Reset token is invalid or expired, please request a new one"
 */
const resetPassword = async (
  req: Request,
  res: Response
) => {
  const { resetToken, newPassword, confirmNewPassword } = req.body;
  await authService.resetPassword({ resetToken, newPassword, confirmNewPassword });

  res.status(200).json({
    status: 'success',
    message: 'Password reset successfully'
  });
};

export {
  signUp,
  login,
  logout,
  updatePassword,
  refreshToken,
  verifyEmailOtp,
  recreateEmailOtp,
  createPasswordResetOtp,
  verifyPasswordResetOtp,
  resetPassword
};
