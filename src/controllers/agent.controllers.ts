import type { NextFunction, Request, Response } from "express";
import { filterVillasSchema } from "../validators/data-validators/agent/filterVillas.ts";
import { sendSuccess } from "../utils/general/response.ts";
import { filterVillasForLandingService, getAllAmmenitiesService } from "../services/agent.services.ts";
import catchAsync from "../utils/general/catchAsync.ts";
import { NotFoundError } from "../utils/errors/customErrors.ts";

// Controller to filter All Villas For Landing Page
export const filterVillasForLanding = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const validatedData = filterVillasSchema.safeParse(req.query);
  
  if (!validatedData.success) {
    throw validatedData.error;
  }

  const updatedData = validatedData.data;
  
  const villas = await filterVillasForLandingService(updatedData);

  if (villas === null) {
    throw new NotFoundError("No villas found matching the search criteria");
  }

  sendSuccess(res, villas, "Villas filtered successfully", 200);
});

// Controller to get All Amenities For Landing Page
export const getAllAmmenities = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const amenities = await getAllAmmenitiesService();

  if (amenities === null || amenities.length === 0) {
    throw new NotFoundError("No amenities found");
  }

  sendSuccess(res, amenities, "Amenities retrieved successfully", 200);
});