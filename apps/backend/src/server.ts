import express, { type Request, type Response } from 'express';

const app = express();
const PORT = Number(process.env.PORT) || 8080;
const HOST = process.env.HOST || '0.0.0.0';

app.get('/', (_req: Request, res: Response) => {
  res.send('Hello from the backend!');
});

app.listen(PORT, HOST, () => {
  const baseUrl = HOST === '0.0.0.0' ? 'localhost' : HOST;
  console.log(`Server is running at http://${baseUrl}:${PORT}`);
});
