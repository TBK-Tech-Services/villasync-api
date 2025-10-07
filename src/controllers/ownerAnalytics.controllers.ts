import type { NextFunction, Request, Response } from "express";
import catchAsync from "../utils/general/catchAsync.ts";
import { sendSuccess } from "../utils/general/response.ts";
import { getAnalyticsSummaryService, getVillaPerformanceService, getMonthlyRevenueService } from "../services/ownerAnalytics.services.ts";
import { ValidationError } from "../utils/errors/customErrors.ts";

// Controller to Get Analytics Summary
export const getAnalyticsSummary = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const ownerIdParam = req.params.ownerId;

    if (!ownerIdParam) {
        throw new ValidationError("Owner ID is required");
    }

    const ownerId = parseInt(ownerIdParam);

    if (isNaN(ownerId)) {
        throw new ValidationError("Invalid Owner ID");
    }

    const summary = await getAnalyticsSummaryService({ ownerId });

    sendSuccess(res, summary, "Analytics summary retrieved successfully", 200);
});

// Controller to Get Villa Performance
export const getVillaPerformance = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const ownerIdParam = req.params.ownerId;

    if (!ownerIdParam) {
        throw new ValidationError("Owner ID is required");
    }

    const ownerId = parseInt(ownerIdParam);

    if (isNaN(ownerId)) {
        throw new ValidationError("Invalid Owner ID");
    }

    const performance = await getVillaPerformanceService({ ownerId });

    sendSuccess(res, performance, "Villa performance retrieved successfully", 200);
});

// Controller to Get Monthly Revenue
export const getMonthlyRevenue = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const ownerIdParam = req.params.ownerId;

    if (!ownerIdParam) {
        throw new ValidationError("Owner ID is required");
    }

    const ownerId = parseInt(ownerIdParam);

    if (isNaN(ownerId)) {
        throw new ValidationError("Invalid Owner ID");
    }

    const revenue = await getMonthlyRevenueService({ ownerId });

    sendSuccess(res, revenue, "Monthly revenue retrieved successfully", 200);
});