import type { NextFunction, Request, Response } from "express";
import { getAllUsersService } from "../services/users.services.ts";
import { sendSuccess } from "../utils/general/response.ts";
import catchAsync from "../utils/general/catchAsync.ts";
import { NotFoundError } from "../utils/errors/customErrors.ts";

// Controller to get All Users
export const getAllUsers = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const users = await getAllUsersService();

  if (!users || users.length === 0) {
    throw new NotFoundError("No users found");
  }

  sendSuccess(res, users, "Users retrieved successfully", 200);
});