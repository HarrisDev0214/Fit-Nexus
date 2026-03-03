import { Router } from 'express';
import { signUp, login, logout, updatePassword } from '@/controllers/auth';
import { validateInput } from '@/middlewares/validate';
import { validateJWT } from '@/middlewares/auth';
import { signupSchema, loginSchema, updatePasswordSchema } from '@/schemas/auth';

const authRouter = Router();

authRouter.post('/signup', validateInput(signupSchema), signUp);
authRouter.post('/login', validateInput(loginSchema), login);
authRouter.post('/logout', validateJWT('access'), logout);
authRouter.put('/update-password', validateJWT('access'), validateInput(updatePasswordSchema), updatePassword);

export default authRouter;
