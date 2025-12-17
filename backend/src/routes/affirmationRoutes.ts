import { Router } from "express";
import { affirmationController } from "../controllers/affirmationController";
import { protect } from "../middleware/authMiddleware";

const router = Router();

// Protect all affirmation routes
router.use(protect);

/**
 * @route   GET /api/affirmations/today
 * @desc    Get or generate the daily affirmation for the authenticated user
 * @access  Private
 */
router.get("/today", affirmationController.getDailyAffirmation);

export default router;
