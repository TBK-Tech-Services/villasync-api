import { Router } from "express";
import { getAnalyticsSummary, getMonthlyRevenue, getVillaPerformance } from "../controllers/ownerAnalytics.controllers.ts";

const router = Router();

// Owner Analytics Endpoints
router.get("/summary/:ownerId", getAnalyticsSummary);
router.get("/villas/performance/:ownerId", getVillaPerformance);
router.get("/revenue/monthly/:ownerId", getMonthlyRevenue);

export default router;