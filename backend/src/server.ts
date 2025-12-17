import app from "./app";
import { connectDatabase, disconnectDatabase } from "./config/database";
import { config } from "./config/env";
import { logger } from "./utils/logger";

/**
 * Server Entry Point
 * * Handles the application lifecycle: startup, database connection, and graceful shutdown.
 * * This file is the interface between the application logic and the runtime environment.
 */

const startServer = async () => {
  try {
    // 1. Connect to Database
    // We strictly wait for the DB connection before accepting traffic.
    await connectDatabase();

    // 2. Start HTTP Server
    const PORT = config.port || 3000;

    const server = app.listen(PORT, () => {
      logger.info(`🚀 Server running in ${config.env} mode on port ${PORT}`);
      logger.info(
        `👉 Health check available at http://localhost:${PORT}/health`
      );
    });

    // 3. Graceful Shutdown Logic
    // Handles signals from Docker/Kubernetes/Render to shut down cleanly.
    const gracefulShutdown = async (signal: string) => {
      logger.info(`${signal} signal received: closing HTTP server`);

      // Stop accepting new connections
      server.close(async () => {
        logger.info("HTTP server closed");

        try {
          // Close DB connection
          await disconnectDatabase();
          logger.info("Database connection closed");
          process.exit(0);
        } catch (err) {
          logger.error("Error during graceful shutdown", err);
          process.exit(1);
        }
      });
    };

    process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
    process.on("SIGINT", () => gracefulShutdown("SIGINT"));

    // Handle unhandled promise rejections (e.g. failed async code outside routes)
    process.on("unhandledRejection", (err: Error) => {
      logger.error("UNHANDLED REJECTION! 💥 Shutting down...", err);
      // Give the server a small window to finish pending requests or just exit
      server.close(() => {
        process.exit(1);
      });
    });

    // Handle uncaught exceptions (e.g. synchronous code errors)
    process.on("uncaughtException", (err: Error) => {
      logger.error("UNCAUGHT EXCEPTION! 💥 Shutting down...", err);
      process.exit(1);
    });
  } catch (error) {
    logger.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();
