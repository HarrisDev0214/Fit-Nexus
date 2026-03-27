import helmet, { type HelmetOptions } from 'helmet';
import type { Express } from 'express';

const helmetOptions: HelmetOptions = {
  // Disable CSP to allow inline scripts and styles from Vue/Vite dev server.
  // Re-enable and configure properly in production if serving frontend from same origin.
  contentSecurityPolicy: false,
  // Disable X-Frame-Options as this is a pure API server returning JSON only.
  // Clickjacking protection is not applicable since there are no HTML pages to embed.
  frameguard: false
};

const helmetMiddleware = (app: Express) => {
  app.use(helmet(helmetOptions));
};

export default helmetMiddleware;
