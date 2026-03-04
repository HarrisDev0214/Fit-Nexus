import { Router } from 'express';
import { signUp, login, logout, updatePassword, refreshToken, verifyEmail, recreateEmailOtp } from '@/controllers/auth';
import { validateInput } from '@/middlewares/validate';
import { validateJWT } from '@/middlewares/auth';
import { signupSchema, loginSchema, updatePasswordSchema, verifyEmailSchema, recreateEmailOtpSchema } from '@/schemas/auth';

const authRouter = Router();

authRouter.post('/signup', validateInput(signupSchema), signUp);
authRouter.post('/login', validateInput(loginSchema), login);
authRouter.post('/logout', validateJWT('access'), logout);
authRouter.put('/update-password', validateJWT('access'), validateInput(updatePasswordSchema), updatePassword);
authRouter.post('/refresh-token', validateJWT('refresh'), refreshToken);
authRouter.post('/email-verification/verify', validateInput(verifyEmailSchema), verifyEmail);
authRouter.post('/email-verification/otp', validateInput(recreateEmailOtpSchema), recreateEmailOtp);

export default authRouter;
