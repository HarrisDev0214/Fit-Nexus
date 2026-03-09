import { Router } from 'express';
import { validateInput } from '@/middlewares/validate';
import { validateJWT } from '@/middlewares/auth';
import {
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
} from '@/controllers/auth';
import {
  signupSchema,
  loginSchema,
  updatePasswordSchema,
  verifyEmailOtpSchema,
  recreateEmailOtpSchema,
  createPasswordResetOtpSchema,
  verifyPasswordResetOtpSchema,
  resetPasswordSchema
} from '@/schemas/auth';

const authRouter = Router();

// Authentication
authRouter.post('/signup', validateInput(signupSchema), signUp);
authRouter.post('/login', validateInput(loginSchema), login);
authRouter.post('/logout', validateJWT('access'), logout);
authRouter.post('/token/refresh', validateJWT('refresh'), refreshToken);

// Email verification
authRouter.post('/email/otp', validateInput(recreateEmailOtpSchema), recreateEmailOtp);
authRouter.post('/email/verify', validateInput(verifyEmailOtpSchema), verifyEmailOtp);

// Password management
authRouter.patch('/password', validateJWT('access'), validateInput(updatePasswordSchema), updatePassword);
authRouter.post('/password/otp', validateInput(createPasswordResetOtpSchema), createPasswordResetOtp);
authRouter.post('/password/verify', validateInput(verifyPasswordResetOtpSchema), verifyPasswordResetOtp);
authRouter.post('/password/reset', validateInput(resetPasswordSchema), resetPassword);

export default authRouter;
