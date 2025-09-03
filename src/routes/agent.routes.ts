import { Router } from "express";
import {
  getAllVillasForLanding,
  searchVillas
} from "../controllers/agent.controllers.ts";

const router = Router();

// API endpoints
router.get("/villas", getAllVillasForLanding);
router.get("/villas/search", searchVillas);

export default router;