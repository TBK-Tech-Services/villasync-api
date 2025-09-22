import type { NextFunction, Request, Response } from "express";
import { getCancellationsCountService, getPendingBookingsCountService, getRecentBookingsService, getTodaysCheckinsService, getTomorrowsCheckinsService, getTotalBookingsCountService, getTotalGuestsCountService, getTotalRevenueService, getTotalVillasCountService, getWeeksCheckinsService } from "../services/adminDashboard.services.ts";
import { sendError, sendSuccess } from "../utils/general/response.ts";

// Controller to get Dashboard Stats
export async function getDashboardStats(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
  try {
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
        icon: "DollarSign", // Frontend mein map karega
        gradient: "bg-gradient-primary",
        trend: "neutral"
      },
      {
        title: "Total Bookings",
        value: String(totalBookings || 0),
        change: "+12% from last month", // Placeholder for now
        icon: "Calendar",
        gradient: "bg-gradient-accent", 
        trend: "up"
      },
      {
        title: "Revenue",
        value: `₹${(totalRevenue || 0).toLocaleString('en-IN')}`, // Indian formatting
        change: "+18% from last month", // Placeholder for now
        icon: "DollarSign",
        gradient: "bg-gradient-secondary",
        trend: "up"
      },
      {
        title: "Guests",
        value: String(totalGuests || 0),
        change: "+8% from last month", // Placeholder for now
        icon: "Users",
        gradient: "bg-gradient-sunset",
        trend: "up"
      },
      {
        title: "Pending",
        value: String(pendingBookings || 0),
        change: "3 urgent", // Static for now, can be dynamic later
        icon: "Clock",
        gradient: "bg-warning",
        trend: "neutral"
      },
      {
        title: "Cancellations", 
        value: String(cancellations || 0),
        change: "-2 from last month", // Placeholder for now
        icon: "CalendarX",
        gradient: "bg-destructive",
        trend: "down"
      }
    ];

    return sendSuccess(res, { stats: dashboardStats }, "Dashboard stats fetched successfully!", 200);
  } 
  catch (error) {
    next(error);
  }
}

// Controller to get Total Count of Villas 
export async function getTotalVillasCount(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
  try {
    const villaCount = await getTotalVillasCountService();

    if(villaCount === null){
      return sendError(res , "Error Getting Count of Villas!" , 404 , null);
    }

    return sendSuccess(res , villaCount , "Successfully Got the Villa Count !" , 200);
  } 
  catch (error) {
    next(error);
  }
}

// Controller to Get Total Count of Bookings
export async function getTotalBookingsCount(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
  try {
    const bookingsCount = await getTotalBookingsCountService();

    if(bookingsCount === null){
      return sendError(res , "Error Getting Count of Bookings!" , 404 , null);
    }

    return sendSuccess(res , bookingsCount , "Successfully Got the Bookings Count !" , 200);
  } 
  catch (error) {
    next(error);
  }
}

// Controller to Get Total Revenue
export async function getTotalRevenue(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
  try {
    const totalRevenue = await getTotalRevenueService();

    if(!totalRevenue){
      return sendError(res, "Didnt Got Total Revenue" , 404 , null);
    }

    return sendSuccess(res , totalRevenue , "Successfully Got Total Revenue!" , 200);
  }
  catch (error) {
    next(error);
  }
}

// Controller to Get Total Count of Guest
export async function getTotalGuestsCount(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
  try {
    const guestCount = await getTotalGuestsCountService();

    if(guestCount === null){
      return sendError(res , "Error Getting Count of Guests!" , 404 , null);
    }

    return sendSuccess(res , guestCount , "Successfully Got the Guest Count !" , 200);
  } 
  catch (error) {
    next(error);
  }
}

// Controller to Get Count of Pending Bookings
export async function getPendingBookingsCount(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
  try {
    const totalPendingBookings = await getPendingBookingsCountService();

    if(totalPendingBookings === null){
      return sendError(res , "Error Getting Count of Pending Bookings!" , 404 , null);
    }

    return sendSuccess(res , totalPendingBookings , "Successfully Got the Pending Bookings Count !" , 200);
  } 
  catch (error) {
    next(error);
  }
}

// Controller to Get Count of Cancellations
export async function getCancellationsCount(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
  try {
    const totalCancelledBookings = await getCancellationsCountService();

    if(totalCancelledBookings === null){
      return sendError(res , "Error Getting Count of Cancelled Bookings!" , 404 , null);
    }

    return sendSuccess(res , totalCancelledBookings , "Successfully Got the Cancelled Bookings Count !" , 200);
  } 
  catch (error) {
    next(error);
  }
}

// Controller to Get Recent Bookings
export async function getRecentBookings(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
  try {
    const recentBookings = await getRecentBookingsService();

    if(recentBookings === null){
      return sendError(res , "Error Getting Recent Bookings!" , 404 , null);
    }

    return sendSuccess(res , recentBookings , "Successfully Got the Recent Bookings!" , 200);
  } 
  catch (error) {
    next(error);
  }
}

// Controller to Get Upcoming Checkins
export async function getUpcomingCheckins(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
  try {
    const totalTodaysCheckin = await getTodaysCheckinsService();

    if(totalTodaysCheckin === null){
      return sendError(res , "Error Getting Total Todays Checkins!" , 404 , null);
    }

    const totalTommorowsCheckin = await getTomorrowsCheckinsService();

    if(totalTommorowsCheckin === null){
      return sendError(res , "Error Getting Total Tommorows Checkins!" , 404 , null);
    }

    const totalWeeksCheckin = await getWeeksCheckinsService();

    if(totalWeeksCheckin === null){
      return sendError(res , "Error Getting Total Weeks Checkins!" , 404 , null);
    }

    const upcomingCheckinsData = {
      today: {
        count: totalTodaysCheckin.count,
        totalIncome: totalTodaysCheckin.totalIncome
      },
      tomorrow: {
        count: totalTommorowsCheckin.count,
        totalIncome: totalTommorowsCheckin.totalIncome
      },
      thisWeek: {
        count: totalWeeksCheckin.count,
        totalIncome: totalWeeksCheckin.totalIncome
      }
    };
    
    return sendSuccess(res, upcomingCheckinsData, "Successfully Got Upcoming Checkins!", 200);
  } 
  catch (error) {
    next(error);
  }
}

// Controller to Get This Month Revenue
export async function getThisMonthRevenue(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    
  } 
  catch (error) {
    next(error);
  }
}

// Controller to Get Last Month Revenue
export async function getLastMonthRevenue(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    
  } 
  catch (error) {
    next(error);
  }
}

// Controller to Get Average Daily Revenue
export async function getAverageDailyRevenue(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    
  } 
  catch (error) {
    next(error);
  }
}

// Controller to Get Monthly growth Rate
export async function getMonthlyGrowthRate(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    
  } 
  catch (error) {
    next(error);
  }
}

// Controller to Get All Villas Occupancy
export async function getAllVillasOccupancy(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    
  } 
  catch (error) {
    next(error);
  }
}