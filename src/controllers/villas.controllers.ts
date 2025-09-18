import type { NextFunction, Request, Response } from "express";
import { addVillaService, checkIfVillaExistService, getAllAmenityCategoriesService, getAllVillasService, getSingleVillaService, updateVillaService } from "../services/villas.services.ts";
import { addVillaSchema } from "../validators/data-validators/villa/addVilla.ts";
import { sendError, sendSuccess } from "../utils/general/response.ts";
import { getVillaSchema } from "../validators/data-validators/villa/getVilla.ts";
import { updateVillaParamsSchema } from "../validators/data-validators/villa/updateVillaParam.ts";
import { updateVillaBodySchema } from "../validators/data-validators/villa/updateVillaBody.ts";
import { searchAndFilterVillasSchema } from "../validators/data-validators/villa/searchAndFilterVillas.ts";

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

// Controller to Search and Filter Villas
export async function searchAndFilterVillas(req: Request, res: Response, next: NextFunction) {
  try {
    const validatedData = searchAndFilterVillasSchema.safeParse(req.query);

    if(!validatedData.success){
      // send error
    }

    console.log(validatedData.data);
  } 
  catch (error) {
    next(error);
  }
}

// Controller to get Recent Bookings of a Villa
export async function getVillaRecentBookings(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    
  } 
  catch (error) {
    next(error);
  }
}

// Controller to get Monthly Revenue of a Villa
export async function getVillaMonthlyRevenue(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    
  } 
  catch (error) {
    next(error);
  }
}

// Controller to get Availability of a Villa
export async function getVillaAvailability(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    
  } 
  catch (error) {
    next(error);
  }
}