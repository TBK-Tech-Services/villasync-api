import type { NextFunction, Request, Response } from "express";
import catchAsync from "../utils/general/catchAsync.ts";
import { sendSuccess } from "../utils/general/response.ts";
import { getOwnerCalendarAvailabilityService } from "../services/ownerCalendar.services.ts";
import { ValidationError } from "../utils/errors/customErrors.ts";

// Controller to Get Owner Calendar Availability
export const getOwnerCalendarAvailability = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const ownerIdParam = req.params.ownerId;

    if (!ownerIdParam) {
        throw new ValidationError("Owner ID is required");
    }

    const ownerId = parseInt(ownerIdParam);

    if (isNaN(ownerId)) {
        throw new ValidationError("Invalid Owner ID");
    }

    const availability = await getOwnerCalendarAvailabilityService({ ownerId });

    sendSuccess(res, availability, "Calendar availability retrieved successfully", 200);
});