import { Request, Response, NextFunction } from "express";
import { logger } from "../utils/logger";
import { AppError } from "../utils/AppError";
import { config } from "../config/env";

/**
 * Global Error Handler Middleware
 * * Centralizes all error response logic.
 * * Ensures consistent JSON structure for clients.
 * * Prevents sensitive stack traces from leaking in production.
 */

// Function to handle specific error types (e.g., Mongoose, JWT)
// and normalize them into trusted AppErrors
const normalizeError = (err: any): AppError => {
  // 1. Mongoose: CastError (Invalid ID)
  if (err.name === "CastError") {
    return new AppError(`Invalid ${err.path}: ${err.value}`, 400);
  }

  // 2. Mongoose: Duplicate Fields (E11000)
  if (err.code === 11000) {
    const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];
    return new AppError(
      `Duplicate field value: ${value}. Please use another value!`,
      400
    );
  }

  // 3. Mongoose: Validation Error
  if (err.name === "ValidationError") {
    const errors = Object.values(err.errors).map((el: any) => el.message);
    return new AppError(`Invalid input data. ${errors.join(". ")}`, 400);
  }

  // 4. JWT: Invalid Token
  if (err.name === "JsonWebTokenError") {
    return new AppError("Invalid token. Please log in again!", 401);
  }

  // 5. JWT: Expired Token
  if (err.name === "TokenExpiredError") {
    return new AppError("Your token has expired! Please log in again.", 401);
  }

  // If it's already an AppError, return it
  if (err instanceof AppError) {
    return err;
  }

  // Default to generic 500
  return new AppError("Something went wrong!", 500);
};

const sendErrorDev = (err: any, req: Request, res: Response) => {
  res.status(err.statusCode || 500).json({
    status: err.status || "error",
    error: err,
    message: err.message,
    stack: err.stack,
    requestId: (req as any).requestId, // Useful for correlating with logs
  });
};

const sendErrorProd = (err: any, req: Request, res: Response) => {
  // A) Trusted Error: Send message to client
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
      requestId: (req as any).requestId,
    });
  }
  // B) Programming or other unknown error: Don't leak details
  else {
    // 1) Log error
    logger.error("ERROR 💥", err);

    // 2) Send generic message
    res.status(500).json({
      status: "error",
      message: "Something went very wrong!",
      requestId: (req as any).requestId,
    });
  }
};

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Normalize status code
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  if (config.env === "development") {
    sendErrorDev(err, req, res);
  } else {
    // Normalize libraries' errors to AppError
    let error = { ...err };
    error.message = err.message;

    // Check specific error names to normalize
    if (
      err.name === "CastError" ||
      err.name === "ValidationError" ||
      err.name === "JsonWebTokenError" ||
      err.name === "TokenExpiredError" ||
      err.code === 11000
    ) {
      error = normalizeError(err);
    }

    // If we didn't normalize it and it wasn't an operational AppError, it remains generic 500
    if (!error.isOperational) {
      // Double check if we should normalize generic errors that were cloned
      error = normalizeError(err);
    }

    sendErrorProd(error, req, res);
  }
};
