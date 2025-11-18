import swaggerJsdoc from 'swagger-jsdoc';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'RGIPT Student Hub API',
      version: '1.0.0',
      description: 'REST API documentation for RGIPT Student Hub mobile application',
      contact: {
        name: 'Om Sherikar',
        email: 'contact@example.com',
      },
    },
    servers: [
      {
        url: 'http://localhost:3001',
        description: 'Development server',
      },
      {
        url: 'https://api.rgipt-hub.com',
        description: 'Production server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
    tags: [
      { name: 'Auth', description: 'Authentication endpoints' },
      { name: 'Students', description: 'Student-specific endpoints' },
      { name: 'Courses', description: 'Course management endpoints' },
      { name: 'Tests', description: 'Tests and grades endpoints' },
      { name: 'Fees', description: 'Fee management endpoints' },
      { name: 'Messages', description: 'Messaging endpoints' },
      { name: 'Notifications', description: 'Notification endpoints' },
      { name: 'Admin', description: 'Admin management endpoints' },
    ],
  },
  apis: ['./src/routes/*.ts'],
};

export const swaggerSpec = swaggerJsdoc(options);
