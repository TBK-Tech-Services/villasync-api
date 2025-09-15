import type { NextFunction, Request, Response } from "express";
import { addVillaService, checkIfVillaExistService } from "../services/villas.services.ts";
import { addVillaSchema } from "../validators/data-validators/villa/addVilla.ts";
import { sendError, sendSuccess } from "../utils/general/response.ts";

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

    // filter the amenities jo already hai

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

// Controller to Update a Villa
export async function updateVilla(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
  try {
    
  } 
  catch (error) {
    next(error);
  }
}

// Controller to get All Villas
export async function getAllVillas(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    
  } 
  catch (error) {
    next(error);
  }
}

// Controller to get a Single Villa
export async function getSingleVilla(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    
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