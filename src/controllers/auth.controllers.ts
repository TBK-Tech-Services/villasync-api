import type { NextFunction, Request, Response } from "express";
import { hashPassword } from "../utils/auth/hashPassword.ts";
import { getUserService, signupUserService } from "../services/auth.services.ts";
import { sendError, sendSuccess } from "../utils/general/response.ts";

export async function signupUser(req: Request, res: Response, next: NextFunction): Promise<Response> {
  try {
    const {
      firstName,
      lastName,
      email,
      password,
      role
    } = req.body;

    if(!firstName || !lastName || !email || !password || !role){
      return sendError(res, "Fill all fields to continue...", 400);
    }

    const hashedPassword = await hashPassword(password);

    if(!hashedPassword){
      return sendError(res, "Failed to hash password...", 500);
    }

    const user = await getUserService({email});

    if(user){
      return sendError(res, "User already exists...", 409);
    }

    const newUser = await signupUserService({firstName , lastName , email , password: hashedPassword , role});
    return sendSuccess(res, newUser, "User created successfully", 201);
  } 
  catch (error) {
    next(error);
    return res;
  }
}

export async function loginUser(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    
  } 
  catch (error) {
    next(error);
  }
}

export async function logoutUser(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
  
  } 
  catch (error) {
    next(error);
  }
}

export async function forgotPassword(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    
  } 
  catch (error) {
    next(error);
  }
}

export async function changePassword(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    
  } 
  catch (error) {
    next(error);
  }
}