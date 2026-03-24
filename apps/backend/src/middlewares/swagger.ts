import type { Express } from 'express';
import basicAuth from 'express-basic-auth';
import { swaggerConfig } from '@/config/env';
import swaggerUi from 'swagger-ui-express';
import swaggerDocs from '@/swagger/docs';

const setupSwagger = (app: Express) => {
  if (process.env.NODE_ENV !== 'development') {
    return;
  }

  app.use('/api-docs',
    basicAuth({
      users: { [swaggerConfig.user]: swaggerConfig.password },
      challenge: true,
      realm: 'API Documentation'
    }),
    swaggerUi.serve,
    swaggerUi.setup(swaggerDocs)
  );
};

export default setupSwagger;
