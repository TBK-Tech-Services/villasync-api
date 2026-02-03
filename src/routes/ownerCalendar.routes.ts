import { Router } from "express";
import { getOwnerCalendarBookings } from "../controllers/ownerCalendar.controllers";

const router = Router();

// Owner Calendar Endpoint
router.get("/bookings/:ownerId", getOwnerCalendarBookings);

export default router;