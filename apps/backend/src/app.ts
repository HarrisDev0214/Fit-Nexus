import express, { type Request, type Response } from 'express';
import basicAuth from 'express-basic-auth';
import { swaggerConfig } from '@/config/env';
import { jsonErrorHandler, globalErrorHandler } from '@/middlewares/errorHandler';
import { NotFound404Error } from '@/utils/errors';
import authRouter from '@/routes/auth';
import swaggerUi from 'swagger-ui-express';
import swaggerDocs from '@/swagger/docs';

const app = express();

app.use('/api-docs',
  basicAuth({
    users: { [swaggerConfig.user]: swaggerConfig.password },
    challenge: true,
    realm: 'API Documentation'
  }),
  swaggerUi.serve,
  swaggerUi.setup(swaggerDocs)
);
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
