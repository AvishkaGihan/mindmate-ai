import { Router } from "express";
import { authController } from "../controllers/authController";
import { authLimiter } from "../middleware/rateLimiter";

const router = Router();

/**
 * @route   POST /api/auth/verify-token
 * @desc    Login/Register using Firebase ID Token
 * @access  Public
 */
router.post("/verify-token", authLimiter, authController.verifyToken);

/**
 * @route   POST /api/auth/refresh-token
 * @desc    Get new access token using a refresh token
 * @access  Public
 */
router.post("/refresh-token", authController.refreshToken);

/**
 * @route   POST /api/auth/logout
 * @desc    Logout user (stateless, mostly for client cleanup/blacklist)
 * @access  Public
 */
router.post("/logout", authController.logout);

export default router;
