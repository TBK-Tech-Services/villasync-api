import { Router } from "express";
import {getFinanceDashboard} from "../controllers/finance.controllers.ts";

const router = Router();

// Finance Endpoints
router.get("/dashboard", getFinanceDashboard);  

export default router;