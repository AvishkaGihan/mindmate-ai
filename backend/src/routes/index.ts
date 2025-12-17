import { Router } from "express";
import authRoutes from "./authRoutes";
import journalRoutes from "./journalRoutes";
import moodRoutes from "./moodRoutes";
import chatRoutes from "./chatRoutes";
import affirmationRoutes from "./affirmationRoutes";
import syncRoutes from "./syncRoutes";

const router = Router();

/**
 * Main Router
 * Aggregates all feature-specific routes into a single API structure.
 */

router.use("/auth", authRoutes);
router.use("/journals", journalRoutes);
router.use("/moods", moodRoutes);
router.use("/chat", chatRoutes);
router.use("/affirmations", affirmationRoutes);
router.use("/sync", syncRoutes);

export default router;
