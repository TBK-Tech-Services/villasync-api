import { Router } from "express";
import {
  getRecentBookings,
  getAllVillasOccupancy,
  getUpcomingCheckins,
  getDashboardStats,
  getRevenueTrends
} from "../controllers/adminDashboard.controllers.ts";

const router = Router();

// Admin Page Endpoints
router.get("/kpis/dashboard-stats", getDashboardStats);
router.get("/recent-bookings", getRecentBookings);
router.get("/upcoming-checkins", getUpcomingCheckins);
router.get("/revenue-trends", getRevenueTrends);  
router.get("/villas-occupancy", getAllVillasOccupancy);  

export default router;