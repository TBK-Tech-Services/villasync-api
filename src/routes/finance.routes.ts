import { Router } from "express";
import { generateFinanceReport, getFinanceDashboard, getNetRevenueDashboard } from "../controllers/finance.controllers.ts";

const router = Router();

// Finance Endpoints
router.get("/dashboard", getFinanceDashboard);
router.get("/net-revenue", getNetRevenueDashboard);
router.get("/report", generateFinanceReport);

export default router;