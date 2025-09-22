import { Router } from "express";
import {
  getTotalVillasCount,
  getTotalBookingsCount,
  getTotalRevenue,
  getTotalGuestsCount,
  getPendingBookingsCount,
  getCancellationsCount,
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
router.get("/kpis/villas-count", getTotalVillasCount);
router.get("/kpis/bookings-count", getTotalBookingsCount);
router.get("/kpis/revenue", getTotalRevenue);
router.get("/kpis/guests-count", getTotalGuestsCount);
router.get("/kpis/pending-bookings", getPendingBookingsCount);
router.get("/kpis/cancellations", getCancellationsCount);
router.get("/recent-bookings", getRecentBookings);
router.get("/upcoming-checkins", getUpcomingCheckins);
router.get("/revenue/this-month", getThisMonthRevenue);  
router.get("/revenue/last-month", getLastMonthRevenue);  
router.get("/revenue/daily-average", getAverageDailyRevenue);  
router.get("/revenue/monthly-growth", getMonthlyGrowthRate);  
router.get("/villas-occupancy", getAllVillasOccupancy);  

export default router;