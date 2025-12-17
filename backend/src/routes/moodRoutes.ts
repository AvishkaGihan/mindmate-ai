import { Router } from "express";
import { moodController } from "../controllers/moodController";
import { protect } from "../middleware/authMiddleware";

const router = Router();

// Protect all mood routes
router.use(protect);

/**
 * @route   GET /api/moods/insights
 * @desc    Get aggregated mood statistics for charts
 * @access  Private
 */
router.get("/insights", moodController.getStats);

/**
 * @route   POST /api/moods
 * @desc    Log a new mood entry
 * @access  Private
 */
router.post("/", moodController.logMood);

/**
 * @route   GET /api/moods
 * @desc    Get mood history (supports ?startDate=&endDate=)
 * @access  Private
 */
router.get("/", moodController.getHistory);

export default router;
