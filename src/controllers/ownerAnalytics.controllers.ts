import type { NextFunction, Request, Response } from "express";
import catchAsync from "../utils/general/catchAsync.ts";
import { sendSuccess } from "../utils/general/response.ts";
import { getAnalyticsSummaryService, getVillaPerformanceService, getMonthlyRevenueService, getOwnerPerformanceService, getOwnerNetRevenueService } from "../services/ownerAnalytics.services.ts";
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

// Controller to Get Owner Performance KPIs
export const getOwnerPerformance = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const ownerIdParam = req.params.ownerId;

    if (!ownerIdParam) {
        throw new ValidationError("Owner ID is required");
    }

    const ownerId = parseInt(ownerIdParam);

    if (isNaN(ownerId)) {
        throw new ValidationError("Invalid Owner ID");
    }

    const data = await getOwnerPerformanceService({ ownerId });

    sendSuccess(res, data, "Owner performance retrieved successfully", 200);
});

// Controller to Get Owner Net Revenue
export const getOwnerNetRevenue = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const ownerIdParam = req.params.ownerId;

    if (!ownerIdParam) {
        throw new ValidationError("Owner ID is required");
    }

    const ownerId = parseInt(ownerIdParam);

    if (isNaN(ownerId)) {
        throw new ValidationError("Invalid Owner ID");
    }

    const data = await getOwnerNetRevenueService({ ownerId });

    sendSuccess(res, data, "Owner net revenue retrieved successfully", 200);
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