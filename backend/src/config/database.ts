import mongoose from "mongoose";
import { config } from "./env";

/**
 * Mongoose Configuration & Connection Logic
 * Handles the connection to MongoDB Atlas and manages connection lifecycle events.
 */

// Explicitly set strictQuery to true to suppress Mongoose 7+ warning
// and prepare for Mongoose 8 default behavior.
mongoose.set("strictQuery", true);

const connectDatabase = async (): Promise<void> => {
  try {
    const uri = config.db.uri;

    // Standard Mongoose connection options
    // Note: useNewUrlParser and useUnifiedTopology are no longer needed in Mongoose 6+
    // but we keep the options object open for timeouts or poolSize if needed.
    const options: mongoose.ConnectOptions = {
      // Free Tier constraints: Atlas Free Tier has a limit of 500 connections.
      // We set the pool size conservatively to avoid exhausting limits if multiple instances spin up.
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000, // Fail fast if DB is unreachable
      socketTimeoutMS: 45000, // Close sockets after 45s of inactivity
    };

    await mongoose.connect(uri, options);

    console.info(`✅ MongoDB Connected: ${mongoose.connection.host}`);
  } catch (error) {
    console.error("❌ MongoDB connection error:", error);
    // Exit process with failure code to let Docker/orchestrator restart the container
    process.exit(1);
  }
};

// ============================================================================
// Connection Events
// ============================================================================

mongoose.connection.on("disconnected", () => {
  console.warn("⚠️  MongoDB disconnected. Attempting to reconnect...");
});

mongoose.connection.on("reconnected", () => {
  console.info("✅ MongoDB reconnected.");
});

mongoose.connection.on("error", (err) => {
  console.error("❌ MongoDB runtime error:", err);
});

// ============================================================================
// Graceful Shutdown
// ============================================================================

const disconnectDatabase = async (): Promise<void> => {
  try {
    await mongoose.connection.close();
    console.info("MongoDB connection closed through app termination");
  } catch (err) {
    console.error("Error during MongoDB disconnect", err);
    throw err;
  }
};

// Listen for termination signals (e.g., Ctrl+C or Docker stop)
process.on("SIGINT", disconnectDatabase);
process.on("SIGTERM", disconnectDatabase);

export { connectDatabase, disconnectDatabase };
