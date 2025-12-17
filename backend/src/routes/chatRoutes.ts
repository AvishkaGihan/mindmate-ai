import { Router } from "express";
import { chatController } from "../controllers/chatController";
import { protect } from "../middleware/authMiddleware";
import { aiLimiter } from "../middleware/rateLimiter";

const router = Router();

// Protect all chat routes
router.use(protect);

/**
 * @route   POST /api/chat
 * @desc    Send a message to the AI and get a response
 * @access  Private
 * @note    Rate limited by aiLimiter to protect API quota
 */
router.post("/", aiLimiter, chatController.sendMessage);

// Optional: Route to clear history if the client needs it (exposed from controller)
// router.delete('/history', chatController.clearHistory);

export default router;
