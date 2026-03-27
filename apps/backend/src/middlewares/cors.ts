import cors from 'cors';
import type { Express } from 'express';

const allowedOrigins = process.env.CORS_ORIGINS
  ?.split(',')
  .map(origin => origin.trim())
  .filter(origin => origin.length > 0);

const corsOptions: cors.CorsOptions = {
  origin: allowedOrigins,
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
  credentials: true
};

const corsMiddleware = (app: Express) => {
  app.use(cors(corsOptions));
};

export default corsMiddleware;
