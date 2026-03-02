import { Router } from 'express';
import { signUp, login } from '@/controllers/auth';
import { validateInput } from '@/middlewares/validate';
import { signupSchema, loginSchema } from '@/schemas/auth';

const authRouter = Router();

authRouter.post('/signup', validateInput(signupSchema), signUp);
authRouter.post('/login', validateInput(loginSchema), login);

export default authRouter;
