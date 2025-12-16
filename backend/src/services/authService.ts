import jwt from "jsonwebtoken";
import { firebaseAuth } from "../config/firebase";
import { config } from "../config/env";
import User from "../models/User";
import { IUser, Role, AuthProvider } from "../types";
import { AppError } from "../utils/AppError";

/**
 * Authentication Service
 * * Orchestrates the "Hybrid Auth" flow:
 * 1. Verifies Firebase ID Tokens (trusted Identity Provider).
 * 2. Syncs user identity to local MongoDB (Just-In-Time Provisioning).
 * 3. Issues custom JWTs for session management to reduce Firebase RTT.
 */

interface AuthResult {
  user: IUser;
  accessToken: string;
  refreshToken: string;
}

export class AuthService {
  /**
   * Exchanges a valid Firebase ID Token for a backend Session JWT.
   * Handles user creation if they don't exist (JIT Provisioning).
   */
  public async loginWithFirebase(idToken: string): Promise<AuthResult> {
    try {
      // 1. Verify the token with Firebase Admin SDK
      const decodedToken = await firebaseAuth.verifyIdToken(idToken);
      const { uid, email, name } = decodedToken;

      if (!email) {
        throw new AppError("Firebase token missing email", 400);
      }

      // 2. Find or Create User in MongoDB
      let user = await User.findOne({ firebaseUid: uid });

      if (!user) {
        // Just-In-Time Provisioning
        user = await User.create({
          firebaseUid: uid,
          email,
          name: name || "MindMate User",
          provider: AuthProvider.EMAIL, // Simplified; could detect Google/etc from token
          role: Role.USER,
          preferences: {
            notificationsEnabled: true,
            theme: "system",
          },
        });
      } else {
        // Update metadata on login if changed
        if (name && user.name !== name) {
          user.name = name;
          await user.save();
        }
      }

      // 3. Generate Backend Tokens
      const accessToken = this.signAccessToken(user.toObject() as IUser);
      const refreshToken = this.signRefreshToken(user.toObject() as IUser);

      return { user: user.toObject() as IUser, accessToken, refreshToken };
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError("Authentication failed: Invalid Firebase Token", 401);
    }
  }

  /**
   * Generates a new Access Token using a valid Refresh Token.
   */
  public async refreshAccessToken(
    token: string
  ): Promise<{ accessToken: string }> {
    try {
      // Verify the refresh token
      const decoded = jwt.verify(token, config.auth.jwtRefreshSecret) as {
        userId: string;
      };

      // Check if user still exists and isn't banned/deleted
      const user = await User.findById(decoded.userId);
      if (!user) {
        throw new AppError(
          "User belonging to this token no longer exists.",
          401
        );
      }

      // Issue new access token
      const accessToken = this.signAccessToken(user.toObject() as IUser);

      return { accessToken };
    } catch (error) {
      throw new AppError("Invalid or expired refresh token", 401);
    }
  }

  // ============================================================================
  // Private Helpers
  // ============================================================================

  private signAccessToken(user: IUser): string {
    return jwt.sign(
      {
        userId: user._id,
        email: user.email,
        role: user.role,
      },
      config.auth.jwtSecret,
      { expiresIn: config.auth.jwtExpiresIn } as any
    );
  }

  private signRefreshToken(user: IUser): string {
    return jwt.sign({ userId: user._id }, config.auth.jwtRefreshSecret, {
      expiresIn: config.auth.jwtRefreshExpiresIn,
    } as any);
  }
}

export const authService = new AuthService();
