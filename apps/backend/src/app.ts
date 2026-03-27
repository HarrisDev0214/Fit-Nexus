import express, { type Request, type Response } from 'express';
import { jsonErrorHandler, globalErrorHandler } from '@/middlewares/errorHandler';
import { NotFound404Error } from '@/utils/errors';
import authRouter from '@/routes/auth';
import setupSwagger from '@/middlewares/swagger';
import corsMiddleware from '@/middlewares/cors';
import helmetMiddleware from '@/middlewares/helmet';
import { generalLimiter } from '@/middlewares/rateLimit';

const app = express();

helmetMiddleware(app);
setupSwagger(app);
corsMiddleware(app);
app.use(generalLimiter);
app.use(express.json());
app.use(jsonErrorHandler);

app.get('/', (_req: Request, res: Response) => {
  res.send('Hello from the backend!');
});
app.use('/api/v1/auth', authRouter);

app.use((req, _res, next) => {
  const err = new NotFound404Error(`Cannot find ${req.originalUrl} route.`);
  next(err);
});

app.use(globalErrorHandler);

export default app;
