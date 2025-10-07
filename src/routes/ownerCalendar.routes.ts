import { Router } from "express";
import { getOwnerCalendarAvailability } from "../controllers/ownerCalendar.controllers.ts";

const router = Router();

// Owner Calendar Endpoint
router.get("/availability/:ownerId", getOwnerCalendarAvailability);

export default router;