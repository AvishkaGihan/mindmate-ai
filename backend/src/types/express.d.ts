import { JwtPayload } from "./index";

/**
 * Express Request Declaration Merging
 *
 * This file extends the standard Express Request interface to include the 'user' property,
 * which is injected by the authentication middleware (extractJwt).
 *
 * Without this, TypeScript would throw an error when accessing req.user in controllers.
 */

declare global {
  namespace Express {
    interface Request {
      // The user property is optional because it might not be present on public routes
      // or before the auth middleware has run.
      user?: JwtPayload;
    }
  }
}
