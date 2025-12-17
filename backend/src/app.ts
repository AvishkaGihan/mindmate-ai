import express, { Express, Request, Response } from "express";
import helmet from "helmet";
import cors from "cors";
import { config } from "./config/env";
import routes from "./routes";
import { errorHandler } from "./middleware/errorHandler";
import { requestLogger } from "./middleware/requestLogger";
import { globalLimiter } from "./middleware/rateLimiter";

/**
 * Express Application Configuration
 * * Sets up the middleware chain, routing, and error handling.
 * * Separated from server.ts to facilitate integration testing (no port binding).
 */

const app: Express = express();

// ============================================================================
// Global Middleware
// ============================================================================

// 1. Security Headers (Helmet)
app.use(helmet());

// 2. CORS Configuration
// Allow requests only from the frontend/mobile domains defined in config
app.use(
  cors({
    origin: config.cors.origin,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
    credentials: true,
  })
);

// 3. Rate Limiting (Global DOS Protection)
app.use(globalLimiter);

// 4. Request Logging (Observability)
app.use(requestLogger);

// 5. Body Parsing
// Limit body size to prevent payload overflow attacks
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));

// ============================================================================
// Routes
// ============================================================================

// Health Check (for Load Balancers/Render)
app.get("/health", (req: Request, res: Response) => {
  res.status(200).json({ status: "ok", timestamp: new Date().toISOString() });
});

// Mount API Routes
// All features are prefixed with /api (e.g., /api/auth, /api/journals)
app.use("/api", routes);

// 404 Handler for undefined routes
app.use((req: Request, res: Response) => {
  res.status(404).json({
    status: "fail",
    message: `Can't find ${req.originalUrl} on this server!`,
  });
});

// ============================================================================
// Error Handling
// ============================================================================

// Global Error Handler (Must be the last middleware)
app.use(errorHandler);

export default app;
