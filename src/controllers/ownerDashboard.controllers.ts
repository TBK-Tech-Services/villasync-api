import type { NextFunction, Request, Response } from "express";
import catchAsync from "../utils/general/catchAsync.ts";

// Controller to Get Owner Dashboard Stats
export const getOwnerDashboardStats = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    // TODO: Implement logic
});

// Controller to Get Owner Villas
export const getOwnerVillas = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    // TODO: Implement logic
});

// Controller to Get Recent Bookings
export const getRecentBookings = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    // TODO: Implement logic
});