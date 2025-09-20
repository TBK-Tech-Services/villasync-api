import type { NextFunction, Request, Response } from "express";
import { getRecentBookingsService, getTotalBookingsCountService, getTotalGuestsCountService, getTotalVillasCountService } from "../services/adminDashboard.services.ts";
import { sendError, sendSuccess } from "../utils/general/response.ts";

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
export async function getTotalRevenue(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    
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
export async function getPendingBookingsCount(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    
  } 
  catch (error) {
    next(error);
  }
}

// Controller to Get Count of Cancellations
export async function getCancellationsCount(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    
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

// Controller to Get Todays Checkins
export async function getTodaysCheckins(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    
  } 
  catch (error) {
    next(error);
  }
}

// Controller to Get Tommorows Checkins
export async function getTomorrowsCheckins(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    
  } 
  catch (error) {
    next(error);
  }
}

// Controller to Get Weeks Checkins
export async function getWeeksCheckins(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    
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