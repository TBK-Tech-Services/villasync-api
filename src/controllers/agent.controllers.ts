import type { NextFunction, Request, Response } from "express";
import { filterVillasSchema } from "../validators/data-validators/agent/filterVillas.ts";
import { sendError, sendSuccess } from "../utils/general/response.ts";
import { filterVillasForLandingService } from "../services/agent.services.ts";

// Controller to filter All Villas For Landing Page
export async function filterVillasForLanding(req: Request, res: Response, next: NextFunction): Promise<Response |void> {
  try {
    const validatedData = filterVillasSchema.safeParse(req.query);
    
    if(!validatedData.success){
      return sendError(res , "Validator Error !" , 400 , null);
    }

    const updatedData = validatedData.data;
    
    const villas = await filterVillasForLandingService(updatedData);

    if(villas === null){
      return sendError(res , "Didnt Get Villas!", 404 , null);
    }

    return sendSuccess(res , villas , "Successfully Filtered Villas!" , 200);
  } 
  catch (error) {
    next(error);
  }
}