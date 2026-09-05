import { Router } from "express";
import {
  deletePrediction,
  getHistory,
  toggleFavorite,
} from "../controllers/historyController.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

router.use(requireAuth);
router.get("/", getHistory);
router.delete("/:id", deletePrediction);
router.patch("/:id/favorite", toggleFavorite);

export default router;
