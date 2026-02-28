import express, { type Request, type Response } from 'express';
import { jsonErrorHandler, globalErrorHandler } from '@/middlewares/errorHandler';
import { NotFound404Error } from '@/utils/errors';

const app = express();
const PORT = Number(process.env.PORT) || 8080;
const HOST = process.env.HOST || '0.0.0.0';
app.use(jsonErrorHandler);

app.get('/', (_req: Request, res: Response) => {
  res.send('Hello from the backend!');
});

app.use((req, _res, next) => {
  const err = new NotFound404Error(`Cannot find ${req.originalUrl} route.`);
  next(err);
});

app.use(globalErrorHandler);

app.listen(PORT, HOST, () => {
  const baseUrl = HOST === '0.0.0.0' ? 'localhost' : HOST;
  console.log(`Server is running at http://${baseUrl}:${PORT}`);
});
