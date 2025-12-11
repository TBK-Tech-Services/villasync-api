import { Router } from "express";
import { generateFinanceReport, getFinanceDashboard } from "../controllers/finance.controllers.ts";

const router = Router();

// Finance Endpoints
router.get("/dashboard", getFinanceDashboard);
router.get("/report", generateFinanceReport);

export default router;