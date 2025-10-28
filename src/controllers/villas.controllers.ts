import type { NextFunction, Request, Response } from "express";
import { addVillaService, checkIfVillaExistService, deleteVillaService, getAllAmenityCategoriesService, getAllVillasService, getSingleVillaService, getVillaBookingsService, getVillaRecentBookingsService, isVillaPresentService, updateVillaService } from "../services/villas.services.ts";
import { addVillaSchema } from "../validators/data-validators/villa/addVilla.ts";
import { sendSuccess } from "../utils/general/response.ts";
import { getVillaSchema } from "../validators/data-validators/villa/getVilla.ts";
import { updateVillaParamsSchema } from "../validators/data-validators/villa/updateVillaParam.ts";
import { updateVillaBodySchema } from "../validators/data-validators/villa/updateVillaBody.ts";
import { deleteVillaParamsSchema } from "../validators/data-validators/villa/deleteVillaParams.ts";
import { getVillaIdSchema } from "../validators/data-validators/villa/getVillaId.ts";
import catchAsync from "../utils/general/catchAsync.ts";
import { ValidationError, NotFoundError, ConflictError, InternalServerError } from "../utils/errors/customErrors.ts";

// Controller to Add a Villa
export const addVilla = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const validationResult = addVillaSchema.safeParse(req.body);

  if (!validationResult.success) {
    throw validationResult.error;
  }

  const validatedData = validationResult.data;

  const existingVilla = await checkIfVillaExistService(validatedData.villaName);

  if (existingVilla) {
    throw new ConflictError("Villa with this name already exists");
  }

  const newVilla = await addVillaService(validatedData);

  if (!newVilla) {
    throw new InternalServerError("Failed to create villa");
  }

  sendSuccess(res, newVilla, "Villa created successfully", 201);
});

// Controller to get All Villas
export const getAllVillas = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const villas = await getAllVillasService();

  if (!villas || villas.length === 0) {
    throw new NotFoundError("No villas found");
  }

  sendSuccess(res, villas, "All villas retrieved successfully", 200);
});

// Controller to get a Single Villa
export const getSingleVilla = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const paramId = req.params.id;

  if (!paramId) {
    throw new ValidationError("Villa ID is required");
  }

  const validationResult = getVillaSchema.safeParse({ 
    id: parseInt(paramId) 
  });

  if (!validationResult.success) {
    throw new ValidationError("Invalid villa ID format");
  }

  const villa = await getSingleVillaService(validationResult.data.id);

  if (!villa) {
    throw new NotFoundError("Villa with this ID does not exist");
  }

  sendSuccess(res, villa, "Villa details retrieved successfully", 200);
});

// Controller to get All Amenity Categories
export const getAllAmenityCategories = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const amenitiesCategories = await getAllAmenityCategoriesService();

  if (!amenitiesCategories || amenitiesCategories.length === 0) {
    throw new NotFoundError("No amenity categories found");
  }

  sendSuccess(res, amenitiesCategories, "Amenity categories retrieved successfully", 200);
});

// Controller to Update a Villa
export const updateVilla = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const paramsValidation = updateVillaParamsSchema.safeParse(req.params);

  if (!paramsValidation.success) {
    throw new ValidationError("Invalid villa ID format");
  }

  const villaId = paramsValidation.data.id;

  const bodyValidation = updateVillaBodySchema.safeParse(req.body);

  if (!bodyValidation.success) {
    throw bodyValidation.error;
  }

  const updateData = bodyValidation.data;

  const existingVilla = await getSingleVillaService(villaId);

  if (!existingVilla) {
    throw new NotFoundError("Villa with this ID does not exist");
  }

  if (updateData.villaName && updateData.villaName !== existingVilla.name) {
    const nameConflict = await checkIfVillaExistService(updateData.villaName);
    if (nameConflict) {
      throw new ConflictError("Villa with this name already exists");
    }
  }

  const updatedVilla = await updateVillaService(villaId, updateData);

  if (!updatedVilla) {
    throw new InternalServerError("Failed to update villa");
  }

  sendSuccess(res, updatedVilla, "Villa updated successfully", 200);
});

// Controller to Delete a Villa
export const deleteVilla = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const paramsValidation = deleteVillaParamsSchema.safeParse(req.params);

  if (!paramsValidation.success) {
    throw new ValidationError("Invalid villa ID format");
  }

  const villaId = paramsValidation.data.id;

  // Check if villa exists before deleting
  const existingVilla = await getSingleVillaService(villaId);
  if (!existingVilla) {
    throw new NotFoundError("Villa with this ID does not exist");
  }

  const deletedVilla = await deleteVillaService(villaId);

  if (!deletedVilla) {
    throw new InternalServerError("Failed to delete villa");
  }

  sendSuccess(res, deletedVilla, "Villa deleted successfully", 200);
});

// Controller to get Recent Bookings of a Villa
export const getVillaRecentBookings = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const paramsValidation = getVillaIdSchema.safeParse(req.params);

  if (!paramsValidation.success) {
    throw new ValidationError("Invalid villa ID format");
  }

  const villaId = paramsValidation.data.id;

  const villa = await isVillaPresentService({ villaId });

  if (!villa) {
    throw new NotFoundError("Villa with this ID does not exist");
  }

  const recentBookings = await getVillaRecentBookingsService(villaId);

  if (!recentBookings || recentBookings.length === 0) {
    throw new NotFoundError("No recent bookings found for this villa");
  }

  sendSuccess(res, recentBookings, "Villa recent bookings retrieved successfully", 200);
});

// Controller to get All Bookings of a Villa
export const getVillaBookings = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const paramsValidation = getVillaIdSchema.safeParse(req.params);

  if (!paramsValidation.success) {
    throw new ValidationError("Invalid villa ID format");
  }

  const villaId = paramsValidation.data.id;

  const villa = await isVillaPresentService({ villaId });

  if (!villa) {
    throw new NotFoundError("Villa with this ID does not exist");
  }

  const villaBookings = await getVillaBookingsService(villaId);

  if (!villaBookings || villaBookings.length === 0) {
    throw new NotFoundError("No bookings found for this villa");
  }

  sendSuccess(res, villaBookings, "Villa bookings retrieved successfully", 200);
});