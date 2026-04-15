import express, { Application, NextFunction, Request, Response } from "express";
import dotenvFlow from "dotenv-flow";
import { connect } from "./repository/database";
import routes from "./routes";
import { setupDocs } from "./util/documentation";
import cors, { CorsOptions } from "cors";

dotenvFlow.config();

// create express application
const app: Application = express();

const allowedOrigins = new Set(
  (process.env.CORS_ALLOWED_ORIGINS ??
    [
      "http://localhost:5173",
      "http://127.0.0.1:5173",
      "https://idaballegaard.github.io",
    ].join(","))
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean),
);

const corsOptions: CorsOptions = {
  origin(origin, callback) {
    if (!origin || allowedOrigins.has(origin)) {
      callback(null, true);
      return;
    }

    callback(new Error(`Origin ${origin} is not allowed by CORS`));
  },
  methods: ["GET", "PUT", "POST", "DELETE", "OPTIONS"],
  allowedHeaders: [
    "auth-token",
    "Origin",
    "X-Requested-With",
    "Content-Type",
    "Accept",
    "Authorization",
  ],
  credentials: false,
  optionsSuccessStatus: 204,
};

/**
 * Start the server
 */
export async function startServer() {
  app.use(cors(corsOptions));
  app.options("*", cors(corsOptions));

  //JSON body parser middleware
  app.use(express.json());

  // bind routes to the application
  app.use("/api", routes);

  setupDocs(app);

  app.use((req: Request, res: Response) => {
    res.status(404).json({ error: "Route not found" });
  });

  app.use(
    (error: Error, req: Request, res: Response, next: NextFunction) => {
      if (res.headersSent) {
        next(error);
        return;
      }

      res.status(500).json({
        error: "Internal server error",
        message: error.message,
      });
    },
  );

  await connect();
  console.log("Database connection test successful");

  // start server
  const PORT: number = parseInt(process.env.PORT as string) || 4000;
  app.listen(PORT, function () {
    console.log("Server is running on port: " + PORT);
  });
}
