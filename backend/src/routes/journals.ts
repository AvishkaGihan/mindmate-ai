import { Router } from "express";
import { createJournal, getJournals } from "../controllers/journal";
import { protect } from "../middleware/auth"; // We need to create this middleware

const router = Router();

router.use(protect); // Require login for all routes
router.route("/").post(createJournal).get(getJournals);

export default router;
