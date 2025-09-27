import type { NextFunction, Request, Response } from "express";
import { getAllUsersService } from "../services/users.services.ts";
import { sendError, sendSuccess } from "../utils/general/response.ts";

// Controller to get All Users
export async function getAllUsers(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
  try {
    const users = await getAllUsersService();

    if(!users){
      return sendError(res , "Users doesnt exist" , 404);
    }

    return sendSuccess(res , users , "Users Successfully Retrieved" , 200);
  } 
  catch (error) {
    next(error);
  }
}