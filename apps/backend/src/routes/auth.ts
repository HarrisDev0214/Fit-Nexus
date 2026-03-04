import { Router } from 'express';
import { signUp, login, logout, updatePassword, refreshToken, verifyEmail } from '@/controllers/auth';
import { validateInput } from '@/middlewares/validate';
import { validateJWT } from '@/middlewares/auth';
import { signupSchema, loginSchema, updatePasswordSchema, verifyEmailSchema } from '@/schemas/auth';

const authRouter = Router();

authRouter.post('/signup', validateInput(signupSchema), signUp);
authRouter.post('/login', validateInput(loginSchema), login);
authRouter.post('/logout', validateJWT('access'), logout);
authRouter.put('/update-password', validateJWT('access'), validateInput(updatePasswordSchema), updatePassword);
authRouter.post('/refresh-token', validateJWT('refresh'), refreshToken);
authRouter.post('/email-verification/verify', validateInput(verifyEmailSchema), verifyEmail);

export default authRouter;
