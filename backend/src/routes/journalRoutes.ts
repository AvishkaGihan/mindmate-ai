import { Router } from "express";
import { journalController } from "../controllers/journalController";
import { protect } from "../middleware/authMiddleware";

const router = Router();

// Protect all journal routes
router.use(protect);

router.route("/").get(journalController.getAll).post(journalController.create);

router
  .route("/:id")
  .get(journalController.getOne)
  // We use PATCH for partial updates to align with journalUpdateSchema
  .patch(journalController.update)
  // Supporting PUT as well for full replacements/compatibility if needed
  .put(journalController.update)
  .delete(journalController.delete);

export default router;
