import { Router } from "express";
import { basicHealth, comprehensiveHealth, databaseHealth } from "../controllers/health.controllers.ts";

const router = Router();

// Health Endpoints
router.get("/" , basicHealth);
router.get("/database" , databaseHealth);
router.get("/comprehensive" , comprehensiveHealth);

export default router;