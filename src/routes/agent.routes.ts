import { Router } from "express";
import {filterVillasForLanding} from "../controllers/agent.controllers.ts";

const router = Router();

// Agent Endpoint
router.get("/villas", filterVillasForLanding);

export default router;