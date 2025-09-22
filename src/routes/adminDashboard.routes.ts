import { Router } from "express";
import {
  getRecentBookings,
  getThisMonthRevenue,
  getLastMonthRevenue,
  getAverageDailyRevenue,
  getMonthlyGrowthRate,
  getAllVillasOccupancy,
  getUpcomingCheckins,
  getDashboardStats
} from "../controllers/adminDashboard.controllers.ts";

const router = Router();

// Admin Page Endpoints
router.get("/kpis/dashboard-stats", getDashboardStats);
router.get("/recent-bookings", getRecentBookings);
router.get("/upcoming-checkins", getUpcomingCheckins);
router.get("/revenue/this-month", getThisMonthRevenue);  
router.get("/revenue/last-month", getLastMonthRevenue);  
router.get("/revenue/daily-average", getAverageDailyRevenue);  
router.get("/revenue/monthly-growth", getMonthlyGrowthRate);  
router.get("/villas-occupancy", getAllVillasOccupancy);  

export default router;