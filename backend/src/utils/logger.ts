import winston from "winston";
import { config } from "../config/env";

/**
 * Structured Logger (Winston)
 * * Replaces console.log with a robust, level-aware logging system.
 * * Configuration:
 * - Development: Colorized, human-readable text.
 * - Production: JSON-formatted strings for easy parsing by log aggregators (e.g., Render, Datadog).
 * * Levels:
 * error: 0, warn: 1, info: 2, http: 3, verbose: 4, debug: 5, silly: 6
 */

const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  verbose: 4,
  debug: 5,
  silly: 6,
};

const level = () => {
  const env = config.env || "development";
  const isDevelopment = env === "development";
  // If defined in env, use it; otherwise default to debug in dev, warn in prod
  return config.logging.level || (isDevelopment ? "debug" : "warn");
};

const colors = {
  error: "red",
  warn: "yellow",
  info: "green",
  http: "magenta",
  debug: "white",
};

winston.addColors(colors);

// Custom format for development (human readable)
const devFormat = winston.format.combine(
  winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss:ms" }),
  winston.format.colorize({ all: true }),
  winston.format.printf(
    (info) =>
      `${info.timestamp} ${info.level}: ${info.message} ${
        info.requestId ? `[${info.requestId}]` : ""
      }`
  )
);

// Custom format for production (JSON)
const prodFormat = winston.format.combine(
  winston.format.timestamp(),
  winston.format.json()
);

const format = config.env === "development" ? devFormat : prodFormat;

// Define transports (outputs)
const transports = [
  // Allow the use of console.log effectively by piping to stdout
  // Render and other cloud providers capture stdout automatically.
  new winston.transports.Console(),
];

export const logger = winston.createLogger({
  level: level(),
  levels,
  format,
  transports,
});
