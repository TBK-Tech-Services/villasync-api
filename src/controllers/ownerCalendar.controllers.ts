import type { Request, Response } from "express";
import catchAsync from "../utils/general/catchAsync.ts";
import { sendError, sendSuccess } from "../utils/general/response.ts";
import { getOwnerCalendarBookingsService } from "../services/ownerCalendar.services.ts";

// Controller to Get Owner Calendar Bookings
export const getOwnerCalendarBookings = catchAsync(async (req: Request, res: Response) => {
    const { ownerId } = req.params;

    if (!ownerId) {
        return sendError(res, "Owner ID is required", 400);
    }

    const month = req.query.month as string;
    const year = req.query.year as string;
    const villaId = req.query.villaId as string | undefined;

    if (!month || !year) {
        return sendError(res, "Month and Year are required", 400);
    }

    const bookings = await getOwnerCalendarBookingsService({
        ownerId: Number(ownerId),
        month: Number(month),
        year: Number(year),
        ...(villaId && { villaId: Number(villaId) })  // Conditionally add villaId
    });

    sendSuccess(res, bookings, "Owner calendar bookings retrieved", 200);
});