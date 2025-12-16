import { Request, Response, NextFunction } from "express";
import crypto from "crypto";
import { logger } from "../utils/logger";

/**
 * Request Logger Middleware
 * * Acts as the "Flight Recorder" for the API.
 * * Responsibilities:
 * 1. Generates a unique `requestId` for tracing across logs and client headers.
 * 2. Logs incoming request metadata (Method, URL, IP).
 * 3. Intercepts the response 'finish' event to log the outcome (Status, Duration).
 */

export const requestLogger = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // 1. Generate Correlation ID
  const requestId = crypto.randomUUID();

  // 2. Attach to Context
  // We attach it to the response header so the client can report it back in bugs
  res.setHeader("X-Request-Id", requestId);

  // Attach to request object for downstream controllers to use in their own logs
  // (We use type casting here as extending Express types globally is done in d.ts,
  // but runtime assignment needs to happen here)
  (req as any).requestId = requestId;

  // 3. Start Timer
  const start = process.hrtime();

  // 4. Log on Response Finish
  // We listen to 'finish' to capture the final status code and duration
  res.on("finish", () => {
    // Calculate duration in milliseconds
    const diff = process.hrtime(start);
    const timeInMs = (diff[0] * 1e3 + diff[1] * 1e-6).toFixed(2);

    const message = {
      requestId,
      method: req.method,
      url: req.originalUrl || req.url,
      status: res.statusCode,
      duration: `${timeInMs}ms`,
      ip: req.ip || req.headers["x-forwarded-for"] || req.socket.remoteAddress,
      userAgent: req.get("user-agent") || "unknown",
    };

    // Use 'http' level if available, otherwise 'info'
    // Log levels are usually: error, warn, info, http, verbose...
    if (res.statusCode >= 500) {
      logger.error("Request Error", message);
    } else if (res.statusCode >= 400) {
      logger.warn("Request Warning", message);
    } else {
      logger.http("Request Completed", message);
    }
  });

  next();
};
