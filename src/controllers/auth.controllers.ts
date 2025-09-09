import type { NextFunction, Request, Response } from "express";
import { hashPassword } from "../utils/auth/hashPassword.ts";
import { createAdminService, getAdminService, getUserService  } from "../services/auth.services.ts";
import { sendError, sendSuccess } from "../utils/general/response.ts";
import { comparePassword } from "../utils/auth/comparePassword.ts";
import { generateJWT } from "../utils/auth/generateJWT.ts";

export async function createAdmin(req: Request, res: Response, next: NextFunction): Promise<Response> {
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

    const admin = await getAdminService({email , role});

    if(admin){
      return sendError(res, "Admin with same email already exists...", 409);
    }

    const newAdmin = await createAdminService({firstName , lastName , email , password: hashedPassword , role});

    return sendSuccess(res, newAdmin, "Admin created successfully", 201);
  } 
  catch (error) {
    next(error);
    return res;
  }
}

export async function loginUser(req: Request, res: Response, next: NextFunction): Promise<Response> {
  try {
    const {
      email,
      password
    } = req.body;

    if(!email || !password){
      return sendError(res, "Fill all fields to continue...", 400);
    }

    const user = await getUserService({email});

    if(!user){
      return sendError(res, "User doesnt exist...", 404);
    }

    const passwordMatch = await comparePassword({password , hashedPassword : user.password});

    if(!passwordMatch){
      return sendError(res , "Invalid credentials..." , 401);
    }

    const jwt = await generateJWT({firstName : user.firstName , lastName : user.lastName , email : user.email , role : user.role});

    if(!jwt){
      return sendError(res , "JWT doesnt exist..." , 500);
    }

    res.cookie('jwt' , jwt);

    const {password : _ , ...safeUser} = user;

    return sendSuccess(res , safeUser , "User login successfull" , 200);
  } 
  catch (error) {
    next(error);
    return res;
  }
}

export async function logoutUser(req: Request, res: Response, next: NextFunction): Promise<Response> {
  try {
    res.clearCookie('jwt');
    return sendSuccess(res , null , "User logout successfull" , 200);
  } 
  catch (error) {
    next(error);
    return res;
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