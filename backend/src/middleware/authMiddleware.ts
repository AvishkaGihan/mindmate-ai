import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { config } from "../config/env";
import { AppError } from "../utils/AppError"; // Will be created in Utils chunk
import { JwtPayload } from "../types";

/**
 * Authentication Middleware
 * * Acts as the gatekeeper for protected routes.
 * * Responsibilities:
 * 1. Checks for the presence of the 'Authorization' header.
 * 2. Extracts the Bearer token.
 * 3. Verifies the JWT signature and expiration.
 * 4. Decodes the payload and attaches it to `req.user`.
 */

export const protect = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // 1. Get token and check if it exists
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      throw new AppError(
        "You are not logged in! Please log in to get access.",
        401
      );
    }

    // 2. Verify token
    // jwt.verify throws an error if invalid or expired
    const decoded = jwt.verify(token, config.auth.jwtSecret) as JwtPayload;

    // 3. Check if user still exists
    // In a strict high-security app, we might check the DB here to ensure
    // the user wasn't deleted or password changed after token issuance.
    // For this MVP architecture (stateless JWT), we rely on the token's validity duration (24h).
    // The decoded payload contains the essential user ID and role.

    // 4. Grant Access
    req.user = decoded;
    next();
  } catch (error) {
    // specific handling for JWT library errors
    if ((error as Error).name === "JsonWebTokenError") {
      return next(new AppError("Invalid token. Please log in again.", 401));
    }
    if ((error as Error).name === "TokenExpiredError") {
      return next(
        new AppError("Your token has expired! Please log in again.", 401)
      );
    }

    // Pass generic errors to global error handler
    next(error);
  }
};

/**
 * Authorization Middleware (Role-Based Access Control)
 * Restricts access to specific user roles (e.g., 'admin').
 */
export const restrictTo = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    // req.user is guaranteed to exist here because this runs after `protect`
    if (!req.user || !roles.includes(req.user.role)) {
      return next(
        new AppError("You do not have permission to perform this action", 403)
      );
    }

    next();
  };
};
