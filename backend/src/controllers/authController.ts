import { Request, Response, NextFunction } from "express";
import { authService } from "../services/authService";
import {
  validate,
  firebaseAuthSchema,
  refreshTokenSchema,
} from "../utils/validators";

/**
 * Auth Controller
 * Handles the HTTP layer for user authentication, delegating business logic
 * to the AuthService.
 */
export class AuthController {
  /**
   * Unified Login/Register Flow
   * Accepts a Firebase ID Token, verifies it, and returns backend Session JWTs.
   * Performs Just-In-Time (JIT) provisioning if the user is new.
   */
  public verifyToken = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      // 1. Validate Input
      const { idToken } = validate(firebaseAuthSchema, req.body);

      // 2. Delegate to Service
      const { user, accessToken, refreshToken } =
        await authService.loginWithFirebase(idToken);

      // 3. Send Response
      // We exclude sensitive fields via Mongoose select: false in the model,
      // but explicitly formatting the response is safer.
      res.status(200).json({
        status: "success",
        data: {
          user: {
            id: user._id,
            email: user.email,
            name: user.name,
            role: user.role,
            preferences: user.preferences,
          },
          accessToken,
          refreshToken,
        },
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Refresh Access Token
   * Uses a valid Refresh Token to issue a new Access Token.
   * This allows the mobile app to maintain a session without re-prompting login.
   */
  public refreshToken = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      // 1. Validate Input
      const { refreshToken } = validate(refreshTokenSchema, req.body);

      // 2. Delegate to Service
      const { accessToken } = await authService.refreshAccessToken(
        refreshToken
      );

      // 3. Send Response
      res.status(200).json({
        status: "success",
        data: {
          accessToken,
        },
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Logout
   * Since we use stateless JWTs, the server-side action is minimal.
   * In a stricter security model, we would blacklist the refresh token here.
   * For this architecture, we confirm the request so the client can wipe local storage.
   */
  public logout = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      // Future: Add token to Redis blacklist if needed.
      res.status(200).json({
        status: "success",
        message: "Logged out successfully",
      });
    } catch (error) {
      next(error);
    }
  };
}

export const authController = new AuthController();
