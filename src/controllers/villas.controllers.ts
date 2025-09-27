import type { NextFunction, Request, Response } from "express";
import { addVillaService, checkIfVillaExistService, deleteVillaService, getAllAmenityCategoriesService, getAllVillasService, getSingleVillaService, getVillaBookingsService, getVillaRecentBookingsService, isVillaPresentService, updateVillaService } from "../services/villas.services.ts";
import { addVillaSchema } from "../validators/data-validators/villa/addVilla.ts";
import { sendError, sendSuccess } from "../utils/general/response.ts";
import { getVillaSchema } from "../validators/data-validators/villa/getVilla.ts";
import { updateVillaParamsSchema } from "../validators/data-validators/villa/updateVillaParam.ts";
import { updateVillaBodySchema } from "../validators/data-validators/villa/updateVillaBody.ts";
import { searchAndFilterVillasSchema } from "../validators/data-validators/villa/searchAndFilterVillas.ts";
import { deleteVillaParamsSchema } from "../validators/data-validators/villa/deleteVillaParams.ts";
import { getVillaIdSchema } from "../validators/data-validators/villa/getVillaId.ts";

// Controller to Add a Villa
export async function addVilla(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
  try {
    const validationResult = addVillaSchema.safeParse(req.body);

    if(!validationResult.success){
      return sendError(res , "Validation Failed !!!" , 400 , validationResult.error);
    }

    const validatedData = validationResult.data;
    
    const existingVilla = await checkIfVillaExistService(validatedData?.villaName);

    if(existingVilla){
      return sendError(res , "Villa with this name already exist !!!" , 400 , validationResult.error);
    }

    const newVilla = await addVillaService(validatedData);

    if(!newVilla){
      return sendError(res , "Failed to create a Villa !!!" , 400 , validationResult.error);
    }

    return sendSuccess(res , newVilla , "Villa Created Successfully !!!" , 201);
  } 
  catch (error) {
    next(error);
  }
}

// Controller to get All Villas
export async function getAllVillas(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
  try {
    const villas = await getAllVillasService();

    if(!villas){
      return sendError(res , "Error Getting All Villas !!!" , 400 , null);
    }

    return sendSuccess(res , villas , "Successfully Retrieved All Villas !!!" , 200);
  } 
  catch (error) {
    next(error);
  }
}

// Controller to get a Single Villa
export async function getSingleVilla(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
  try {
    const paramId = req.params.id;

    if (!paramId) {
      return sendError(res, "Villa ID is required", 400, null);
    }

    const validationResult = getVillaSchema.safeParse({ 
      id: parseInt(paramId) 
    });
    
    if (!validationResult.success) {
      return sendError(res, "Invalid villa ID", 400, validationResult.error);
    }

    const villa = await getSingleVillaService(validationResult.data.id);

    if(!villa){
      return sendError(res, "Villa Doesnt Exist", 404, null);
    }

    return sendSuccess(res , villa , "Successfully Retrieved Villa Details" , 200);
  } 
  catch (error) {
    next(error);
  }
}

// Controller to get All Amenity Categories
export async function getAllAmenityCategories(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
  try {
    const amenitiesCategories = await getAllAmenityCategoriesService();

    if(!amenitiesCategories || amenitiesCategories.length === 0){
      return sendError(res , "No Amenity Categories Found" , 404);
    }

    return sendSuccess(res , amenitiesCategories , "Successfully Retrieved All Amenities Categories" , 200);
  }
  catch (error) {
    next(error);
  }
}

// Controller to Update a Villa
export async function updateVilla(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
  try {
    const paramsValidation = updateVillaParamsSchema.safeParse(req.params);

    if (!paramsValidation.success) {
      return sendError(res, "Invalid villa ID", 400, paramsValidation.error);
    }

    const villaId = paramsValidation.data.id;

    const bodyValidation = updateVillaBodySchema.safeParse(req.body);

    if (!bodyValidation.success) {
      return sendError(res, "Validation Failed", 400, bodyValidation.error);
    }

    const updateData = bodyValidation.data;

    const existingVilla = await getSingleVillaService(villaId);

    if (!existingVilla) {
      return sendError(res, "Villa not found", 404, null);
    }

    const updatedVilla = await updateVillaService(villaId, updateData);
    
    if (!updatedVilla) {
      return sendError(res, "Unable to update villa", 500, null);
    }

    return sendSuccess(res, updatedVilla, "Villa updated successfully", 200);
  } 
  catch (error) {
    next(error);
  }
}

// Controller to Delete a Villa
export async function deleteVilla(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
  try {
    const paramsValidation = deleteVillaParamsSchema.safeParse(req.params);

    if (!paramsValidation.success) {
      return sendError(res, "Invalid villa ID", 400, paramsValidation.error);
    }

    const villaId = paramsValidation.data.id;

    const deletedVilla = await deleteVillaService(villaId);
    
    if (!deletedVilla) {
      return sendError(res, "Unable to delete a villa", 500, null);
    }

    return sendSuccess(res, deletedVilla, "Villa deleted successfully", 200);
  } 
  catch (error) {
    next(error);
  }
}

// Controller to get Recent Bookings of a Villa
export async function getVillaRecentBookings(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
  try {
    const paramsValidation = getVillaIdSchema.safeParse(req.params);

    if (!paramsValidation.success) {
      return sendError(res, "Invalid villa ID", 400, paramsValidation.error);
    }

    const villaId = paramsValidation.data.id;

    const villa = await isVillaPresentService({villaId});
    
    if(!villa){
      return sendError(res , "Villa Doesnt Exist !" , 404 , null);
    }

    const recentBookings = await getVillaRecentBookingsService(villaId);

    if(!recentBookings){
      return sendError(res , "Didnt Got Villa Recent Bookings !" , 404 , null);
    }

    return sendSuccess(res , recentBookings , "Successfully Got Villa Recent Bookings !" , 200);
  } 
  catch (error) {
    next(error);
  }
}

// Controller to get All Bookings of a Villa
export async function getVillaBookings(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
  try {
    const paramsValidation = getVillaIdSchema.safeParse(req.params);

    if (!paramsValidation.success) {
      return sendError(res, "Invalid villa ID", 400, paramsValidation.error);
    }

    const villaId = paramsValidation.data.id;

    const villa = await isVillaPresentService({villaId});
    
    if(!villa){
      return sendError(res , "Villa Doesnt Exist !" , 404 , null);
    }

    const recentBookings = await getVillaBookingsService(villaId);

    if(!recentBookings){
      return sendError(res , "Didnt Got Villa Bookings !" , 404 , null);
    }

    return sendSuccess(res , recentBookings , "Successfully Got Villa Bookings !" , 200);
  } 
  catch (error) {
    next(error);
  }
}