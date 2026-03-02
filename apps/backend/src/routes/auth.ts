import { Router } from 'express';
import { signUp } from '@/controllers/auth';
import { validateInput } from '@/middlewares/validate';
import { signupSchema } from '@/schemas/auth';

const authRouter = Router();

authRouter.post('/signup', validateInput(signupSchema), signUp);

export default authRouter;
