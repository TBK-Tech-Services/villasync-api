import type { NextFunction, Request, Response } from "express";
import { getAllVillasOccupancyService, getCancellationsCountService, getPendingBookingsCountService, getRecentBookingsService, getRevenueTrendsService, getTodaysCheckinsService, getTomorrowsCheckinsService, getTotalBookingsCountService, getTotalGuestsCountService, getTotalRevenueService, getTotalVillasCountService, getWeeksCheckinsService } from "../services/adminDashboard.services.ts";
import { sendSuccess } from "../utils/general/response.ts";
import catchAsync from "../utils/general/catchAsync.ts";
import { InternalServerError } from "../utils/errors/customErrors.ts";

// Controller to get Dashboard Stats
export const getDashboardStats = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const [
    totalVillas,
    totalBookings, 
    totalRevenue,
    totalGuests,
    pendingBookings,
    cancellations
  ] = await Promise.all([
    getTotalVillasCountService(),
    getTotalBookingsCountService(),
    getTotalRevenueService(),
    getTotalGuestsCountService(),
    getPendingBookingsCountService(),
    getCancellationsCountService()
  ]);

  const dashboardStats = [
    {
      title: "Total Villas",
      value: String(totalVillas || 0),
      change: "Active properties",
      icon: "DollarSign",
      gradient: "bg-gradient-primary",
      trend: "neutral"
    },
    {
      title: "Total Bookings",
      value: String(totalBookings || 0),
      change: "+12% from last month",
      icon: "Calendar",
      gradient: "bg-gradient-accent", 
      trend: "up"
    },
    {
      title: "Revenue",
      value: `₹${(totalRevenue || 0).toLocaleString('en-IN')}`,
      change: "+18% from last month",
      icon: "DollarSign",
      gradient: "bg-gradient-secondary",
      trend: "up"
    },
    {
      title: "Guests",
      value: String(totalGuests || 0),
      change: "+8% from last month",
      icon: "Users",
      gradient: "bg-gradient-sunset",
      trend: "up"
    },
    {
      title: "Pending",
      value: String(pendingBookings || 0),
      change: "3 urgent",
      icon: "Clock",
      gradient: "bg-warning",
      trend: "neutral"
    },
    {
      title: "Cancellations", 
      value: String(cancellations || 0),
      change: "-2 from last month",
      icon: "CalendarX",
      gradient: "bg-destructive",
      trend: "down"
    }
  ];

  sendSuccess(res, { stats: dashboardStats }, "Dashboard stats fetched successfully", 200);
});

// Controller to Get Recent Bookings
export const getRecentBookings = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const recentBookings = await getRecentBookingsService();

  if (!recentBookings || recentBookings.length === 0) {
    throw new InternalServerError("No recent bookings found");
  }

  sendSuccess(res, recentBookings, "Recent bookings fetched successfully", 200);
});

// Controller to Get Upcoming Checkins
export const getUpcomingCheckins = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const [totalTodaysCheckin, totalTomorrowsCheckin, totalWeeksCheckin] = await Promise.all([
    getTodaysCheckinsService(),
    getTomorrowsCheckinsService(),
    getWeeksCheckinsService()
  ]);

  if (!totalTodaysCheckin || !totalTomorrowsCheckin || !totalWeeksCheckin) {
    throw new InternalServerError("Failed to fetch upcoming checkins data");
  }

  const upcomingCheckinsData = {
    today: {
      count: totalTodaysCheckin.count,
      totalIncome: totalTodaysCheckin.totalIncome
    },
    tomorrow: {
      count: totalTomorrowsCheckin.count,
      totalIncome: totalTomorrowsCheckin.totalIncome
    },
    thisWeek: {
      count: totalWeeksCheckin.count,
      totalIncome: totalWeeksCheckin.totalIncome
    }
  };
  
  sendSuccess(res, upcomingCheckinsData, "Upcoming checkins fetched successfully", 200);
});

// Controller to Get Revenue Trends
export const getRevenueTrends = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const revenueTrend = await getRevenueTrendsService();

  if (!revenueTrend) {
    throw new InternalServerError("Failed to fetch revenue trends data");
  }

  sendSuccess(res, revenueTrend, "Revenue trends fetched successfully", 200);
});

// Controller to Get All Villas Occupancy
export const getAllVillasOccupancy = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const villasOccupancy = await getAllVillasOccupancyService();

  if (!villasOccupancy || villasOccupancy.length === 0) {
    throw new InternalServerError("Failed to fetch villas occupancy data");
  }

  sendSuccess(res, villasOccupancy, "Villas occupancy data fetched successfully", 200);
});