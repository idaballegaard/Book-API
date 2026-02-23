import express, { Application, Request, Response } from 'express';
import dotenvFlow from 'dotenv-flow';
import { testConnection } from './repository/database';
import routes from './routes';
import cors from 'cors';


dotenvFlow.config();

// create express application
const app: Application = express();

/**
 * Start the server
 */
export function startServer() {
    
    app.use(cors({

        // Allow request from any origin
        origin: "*", // localhost and render in an array

        // allow HTTP methods
        methods: ["GET", "PUT", "POST", "DELETE"],

        // allow headers
        allowedHeaders: ['auth-token', 'Origin', 'X-Requested-Width', 'Content-Type', 'Accept'],

        // allow credentials
        credentials:true
    }))

    
    //JSON body parser middleware
    app.use(express.json());

    // bind routes to the application
    app.use('/api', routes);

    // test database connection
    testConnection();

    // start server
    const PORT: number = parseInt(process.env.PORT as string) || 4000;
    app.listen(PORT, function() {
        console.log("Server is running on port: " + PORT);
    });
}
