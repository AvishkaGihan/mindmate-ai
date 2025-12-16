import { Router } from "express";
import { chatWithAI } from "../controllers/chat";
import { protect } from "../middleware/auth";

const router = Router();

router.use(protect);
router.post("/", chatWithAI);

export default router;
