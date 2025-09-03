import { Router } from "express";
import {
  getFinanceDashboard,
  getAllVillasForFinance
} from "../controllers/finance.controllers.ts";

const router = Router();

// API endpoints
router.get("/dashboard", getFinanceDashboard);  
router.get("/villas", getAllVillasForFinance);  

export default router;