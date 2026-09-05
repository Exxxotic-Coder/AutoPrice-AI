import { Router } from "express";
import { compare, getMetadata, predict } from "../controllers/predictController.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

router.get("/metadata", getMetadata);
router.post("/predict", requireAuth, predict);
router.post("/compare", requireAuth, compare);

export default router;
