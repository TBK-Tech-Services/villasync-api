import { Router } from "express";
import { getOwnerDashboardStats, getOwnerVillas, getRecentBookings } from "../controllers/ownerDashboard.controllers.ts";

const router = Router();

// Owner Dashboard Endpoints
router.get("/stats/:ownerId", getOwnerDashboardStats);
router.get("/villas/:ownerId", getOwnerVillas);
router.get("/bookings/recent/:ownerId", getRecentBookings);

export default router;