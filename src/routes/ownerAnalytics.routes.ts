import { Router } from "express";
import { getAnalyticsSummary, getMonthlyRevenue, getVillaPerformance } from "../controllers/ownerAnalytics.controllers.ts";

const router = Router();

// Owner Analytics Endpoints
router.get("/summary", getAnalyticsSummary);
router.get("/villas/performance", getVillaPerformance);
router.get("/revenue/monthly", getMonthlyRevenue);

export default router;