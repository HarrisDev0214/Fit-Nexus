import swaggerJsDoc, { type OAS3Options } from 'swagger-jsdoc';
import schemas from '@/swagger/schemas';

// Swagger configuration
const options: OAS3Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Fit-Nexus API',
      version: '1.0.0',
      description: 'RESTful API for Fit-Nexus fitness tracking application. Provides endpoints for user authentication, workout tracking, and fitness data management.'
    },
    servers: [
      {
        url: 'http://localhost:8080',
        description: 'Development server'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Enter your JWT access token obtained from /auth/login endpoint.\n\nExample: `eyJhbGciOiJIUzI1NiIs...`'
        }
      },
      schemas
    }
  },
  apis: ['./src/controllers/*.ts'] // Path to the API routes folders
};

const swaggerDocs = swaggerJsDoc(options);

export default swaggerDocs;
