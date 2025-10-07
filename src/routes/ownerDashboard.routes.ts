import { Router } from "express";
import { getOwnerDashboardStats, getOwnerVillas, getRecentBookings } from "../controllers/ownerDashboard.controllers.ts";

const router = Router();

// Owner Dashboard Endpoints
router.get("/stats", getOwnerDashboardStats);
router.get("/villas", getOwnerVillas);
router.get("/bookings/recent", getRecentBookings);

export default router;