import type { NextFunction, Request, Response } from "express";
import { hashPassword } from "../utils/auth/hashPassword.ts";
import { createAdminService, getAdminService, getUserService  } from "../services/auth.services.ts";
import { sendSuccess } from "../utils/general/response.ts";
import { comparePassword } from "../utils/auth/comparePassword.ts";
import { generateJWT } from "../utils/auth/generateJWT.ts";
import { loginSchema } from "../validators/data-validators/auth/login.ts";
import catchAsync from "../utils/general/catchAsync.ts";
import { ConflictError, InternalServerError, NotFoundError, UnauthorizedError, ValidationError } from "../utils/errors/customErrors.ts";

// Controller to Create Admin
export const createAdmin = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { firstName, lastName, email, password, role } = req.body;

  if(!firstName || !lastName || !email || !password || !role){
    throw new ValidationError("All fields are required : firstName, lastName, email, password, role");
  }

  const existingAdmin = await getAdminService({ email, role });
  if (existingAdmin) {
    throw new ConflictError("Admin with this email already exists");
  }

  const hashedPassword = await hashPassword(password);
  if (!hashedPassword) {
    throw new InternalServerError("Failed to hash password");
  }

  const newAdmin = await createAdminService({
    firstName,
    lastName,
    email,
    password: hashedPassword,
    role
  });

  if (!newAdmin) {
    throw new InternalServerError("Failed to create admin");
  }

  sendSuccess(res, newAdmin, "Admin created successfully", 201);
});

// Controller to Login User
export const loginUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const validationResult = loginSchema.safeParse(req.body);
  if (!validationResult.success) {
    throw validationResult.error;
  }

  const { email, password } = validationResult.data;

  const user = await getUserService({ email });
  if (!user) {
    throw new NotFoundError("No account found with this email address");
  }

  const passwordMatch = await comparePassword({
    password,
    hashedPassword: user.password
  });
  if (!passwordMatch) {
    throw new UnauthorizedError("Invalid email or password");
  }

  const jwt = await generateJWT({
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    role: user.role
  });
  if (!jwt) {
    throw new InternalServerError("Failed to generate authentication token");
  }

  res.cookie('jwt', jwt);

  const { password: _, ...safeUser } = user;

  sendSuccess(res, safeUser, "Login successful", 200);
});

// Controller to Logout User
export const logoutUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  res.clearCookie('jwt');
  sendSuccess(res, null, "Logout successful", 200);
});