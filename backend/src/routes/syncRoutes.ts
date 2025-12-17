import { Router } from "express";
import { syncController } from "../controllers/syncController";
import { protect } from "../middleware/authMiddleware";

const router = Router();

// Protect all sync routes
router.use(protect);

/**
 * @route   POST /api/sync
 * @desc    Upload offline queue (journals, moods) for synchronization
 * @access  Private
 */
router.post("/", syncController.processQueue);

export default router;
