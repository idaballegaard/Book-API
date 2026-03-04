import swaggerUi from 'swagger-ui-express';
import swaggerJSDoc from 'swagger-jsdoc';
import { Application } from 'express';
import { register } from 'node:module';


/**
 * Setup Swagger documentation for the application
 * @param app 
 */
export function setupDocs(app: Application) {

    // Swagger definition
    const swaggerDefinition = {
        openapi: '3.0.0',
        info: {
            title: 'Book API',
            version: '1.0.0',
            description: 'A simple Express API application documented with Swagger',
        },
        servers: [
            {
                url: 'http://localhost:4000/api',
                description: 'Development server',
            },
        ],
        components: {
            securitySchemes: {
                ApiKeyAuth: {
                    type: 'apiKey',
                    in: 'header',
                    name: 'auth-token',
                },
            },
            schemas: {
                Book: {
                    type: 'object',
                    properties: {
                        title: { type: 'string' },
                        description: { type: 'string' },
                        author: { type: 'string' },
                        publishedDate: { type: 'date' },
                        pages: { type: 'number' },
                        genre: { type: 'string' },
                        rating: { type: 'number' },
                        imageUrl: { type: 'string' },
                        _reviewedBy: { type: 'string' },
                    },
                },
                User: {
                    type: 'object',
                    properties: {
                        id: { type: 'string' },
                        name: { type: 'string' },
                        email: { type: 'string' },
                        password: { type: 'string' },
                        registerDate: { type: 'date' },
                    },
                },
            },
        }
    } 

    // Swagger options
    const options = {
        swaggerDefinition,
        // Paths to files containing OpenAPI definitions
        apis: ['**/*.ts']
    }

    // Swagger specification
    const swaggerSpec = swaggerJSDoc(options);

    // Swagger documentation route
    app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
}