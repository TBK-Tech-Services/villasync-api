import type { NextFunction, Request, Response } from "express";
import { addExpenseSchema } from "../validators/data-validators/expense/addExpense.ts";
import { sendError, sendSuccess } from "../utils/general/response.ts";
import { addExpenseService } from "../services/expenses.services.ts";

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
export async function updateExpense(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    
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