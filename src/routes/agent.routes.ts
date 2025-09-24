import { Router } from "express";
import {filterVillasForLanding, getAllAmmenities} from "../controllers/agent.controllers.ts";

const router = Router();

// Agent Endpoint
router.get("/villas", filterVillasForLanding);
router.get("/ammenities", getAllAmmenities);

export default router;