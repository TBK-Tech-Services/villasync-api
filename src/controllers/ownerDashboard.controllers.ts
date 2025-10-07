import type { NextFunction, Request, Response } from "express";
import catchAsync from "../utils/general/catchAsync.ts";
import { sendSuccess } from "../utils/general/response.ts";
import { getOwnerDashboardStatsService, getOwnerVillasService, getRecentBookingsService } from "../services/ownerDashboard.services.ts";
import { ValidationError } from "../utils/errors/customErrors.ts";

// Controller to Get Owner Dashboard Stats
export const getOwnerDashboardStats = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const ownerIdParam = req.params.ownerId;

    if (!ownerIdParam) {
        throw new ValidationError("Owner ID is required");
    }

    const ownerId = parseInt(ownerIdParam);

    if (isNaN(ownerId)) {
        throw new ValidationError("Invalid Owner ID");
    }

    const stats = await getOwnerDashboardStatsService({ ownerId });

    sendSuccess(res, stats, "Dashboard stats retrieved successfully", 200);
});

// Controller to Get Owner Villas
export const getOwnerVillas = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const ownerIdParam = req.params.ownerId;

    if (!ownerIdParam) {
        throw new ValidationError("Owner ID is required");
    }

    const ownerId = parseInt(ownerIdParam);

    if (isNaN(ownerId)) {
        throw new ValidationError("Invalid Owner ID");
    }

    const villas = await getOwnerVillasService({ ownerId });

    sendSuccess(res, villas, "Villas retrieved successfully", 200);
});

// Controller to Get Recent Bookings
export const getRecentBookings = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const ownerIdParam = req.params.ownerId;

    if (!ownerIdParam) {
        throw new ValidationError("Owner ID is required");
    }

    const ownerId = parseInt(ownerIdParam);

    if (isNaN(ownerId)) {
        throw new ValidationError("Invalid Owner ID");
    }

    const bookings = await getRecentBookingsService({ ownerId });

    sendSuccess(res, bookings, "Recent bookings retrieved successfully", 200);
});