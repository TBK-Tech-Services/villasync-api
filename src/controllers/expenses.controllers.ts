import type { NextFunction, Request, Response } from "express";
import { addExpenseSchema } from "../validators/data-validators/expense/addExpense.ts";
import { sendError, sendSuccess } from "../utils/general/response.ts";
import { addExpenseService, checkIfExpenseExistService, updateExpenseService } from "../services/expenses.services.ts";
import { updateExpenseParamsSchema } from "../validators/data-validators/expense/updateExpenseParams.ts";
import { updateExpenseBodySchema } from "../validators/data-validators/expense/updateExpenseBody.ts";

// Controller to Add An Expense
export async function addExpense(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
  try {
    const validationResult = addExpenseSchema.safeParse(req.body);

    if(!validationResult.success){
      return sendError(res , "Validation Failed !!!" , 400 , validationResult.error);
    }
    
    const validatedData = validationResult.data;

    const newExpense = await addExpenseService(validatedData);

    if(!newExpense){
      return sendError(res , "Didn't get New Expense!" , 404 , null); 
    }

    return sendSuccess(res , newExpense ,"Successfully Added a New Expense !" , 201);
  } 
  catch (error) {
    next(error);
  }
}

// Controller to Update an Expense
export async function updateExpense(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
  try {
    const paramsValidation = updateExpenseParamsSchema.safeParse(req.params);
        
    if (!paramsValidation.success) {
      return sendError(res, "Invalid expense ID", 400, paramsValidation.error);
    }
        
    const expenseId = paramsValidation.data.id;
        
    const bodyValidation = updateExpenseBodySchema.safeParse(req.body);
    
    if (!bodyValidation.success) {
      return sendError(res, "Validation Failed", 400, bodyValidation.error);
    }
        
    const validatedData = bodyValidation.data;

    const expenseExist = await checkIfExpenseExistService(expenseId);

    if(!expenseExist){
      return sendError(res, "Expense Doesn't Exist!", 404, null);
    }

    const updatedExpense = await updateExpenseService({validatedData, expenseId});

    if(!updatedExpense){
      return sendError(res, "Failed to update expense!", 500, null); 
    }

    return sendSuccess(res, updatedExpense, "Successfully Updated Expense!", 200);
  } 
  catch (error) {
    next(error);
  }
}

// Controller to Delete an Expense
export async function deleteExpense(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    
  } 
  catch (error) {
    next(error);
  }
}

// Controller to get All Expenses
export async function getAllExpenses(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    
  } 
  catch (error) {
    next(error);
  }
}

// Controller to get All Villas For Expenses
export async function getAllVillasForExpenses(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    
  } 
  catch (error) {
    next(error);
  }
}