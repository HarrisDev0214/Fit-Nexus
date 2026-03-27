import helmet, { type HelmetOptions } from 'helmet';
import type { Express } from 'express';

const helmetOptions: HelmetOptions = {
  contentSecurityPolicy: false,
  frameguard: false
};

const helmetMiddleware = (app: Express) => {
  app.use(helmet(helmetOptions));
};

export default helmetMiddleware;
