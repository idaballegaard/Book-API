import express, { Application, Request, Response } from "express";
import dotenvFlow from "dotenv-flow";
import { testConnection } from "./repository/database";
import routes from "./routes";
import { setupDocs } from "./util/documentation";
import cors from "cors";

dotenvFlow.config();

// create express application
const app: Application = express();

/**
 * Setup CORS handling for the application
 */
function setUpCors() {
  app.use(
    cors({
      // Allow request from any origin
      origin: "*",

      // Allow methods GET, PUT, POST, DELETE
      methods: "GET, PUT, POST, DELETE",

      // Allow headers
      allowedHeaders: [
        "auth-token",
        "Origin",
        "X-Requested-Width",
        "Content-Type",
        "Accept",
      ],

      // Allow credentials
      credentials: true,
    }),
  );
}

/**
 * Start the server
 */
export function startServer() {
  // setup CORS handling
  setUpCors();

  //JSON body parser middleware
  app.use(express.json());

  // bind routes to the application
  app.use("/api", routes);

  setupDocs(app);

  // test database connection
  testConnection();

  // start server
  const PORT: number = parseInt(process.env.PORT as string) || 4000;
  app.listen(PORT, function () {
    console.log("Server is running on port: " + PORT);
  });
}
