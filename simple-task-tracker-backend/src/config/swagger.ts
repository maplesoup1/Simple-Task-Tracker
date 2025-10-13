import swaggerJsdoc from 'swagger-jsdoc'

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Simple Task Tracker API',
      version: '1.0.0',
      description: 'A simple task tracker API with authentication',
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Frontend proxy (recommended)',
      },
      {
        url: 'http://localhost:8000',
        description: 'Backend server',
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
      schemas: {
        Task: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            userId: { type: 'string' },
            title: { type: 'string' },
            description: { type: 'string', nullable: true },
            status: {
              type: 'string',
              enum: ['TODO', 'IN_PROGRESS', 'DONE'],
            },
            position: { type: 'number' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
        User: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            email: { type: 'string' },
            name: { type: 'string', nullable: true },
            createdAt: { type: 'string', format: 'date-time' },
          },
        },
        Error: {
          type: 'object',
          properties: {
            error: { type: 'string' },
          },
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ['./src/routes/*.ts', './src/controllers/*.ts'],
}

export const swaggerSpec = swaggerJsdoc(options)
