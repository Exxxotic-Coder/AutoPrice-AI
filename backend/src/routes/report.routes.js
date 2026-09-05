import { Router } from "express";
import { downloadReport } from "../controllers/reportController.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

router.get("/:id", requireAuth, downloadReport);

export default router;
