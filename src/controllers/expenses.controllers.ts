import type { NextFunction, Request, Response } from "express";
import { addExpenseSchema } from "../validators/data-validators/expense/addExpense.ts";
import { sendSuccess } from "../utils/general/response.ts";
import { addExpenseService, calculateExpenseSummary, checkIfExpenseExistService, deleteExpenseService, generateExpenseReportPDF, getAllExpenseCategoriesService, getAllExpensesService, getExpenseService, getFilteredExpenses, groupByCategory, groupByVilla, updateExpenseService } from "../services/expenses.services.ts";
import { updateExpenseParamsSchema } from "../validators/data-validators/expense/updateExpenseParams.ts";
import { updateExpenseBodySchema } from "../validators/data-validators/expense/updateExpenseBody.ts";
import { getExpenseSchema } from "../validators/data-validators/expense/getExpense.ts";
import { deleteExpenseSchema } from "../validators/data-validators/expense/deleteExpense.ts";
import catchAsync from "../utils/general/catchAsync.ts";
import { ValidationError, NotFoundError, InternalServerError } from "../utils/errors/customErrors.ts";

// Controller to Add An Expense
export const addExpense = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const validationResult = addExpenseSchema.safeParse(req.body);

  if (!validationResult.success) {
    throw validationResult.error;
  }

  const validatedData = validationResult.data;

  const newExpense = await addExpenseService(validatedData);

  if (!newExpense) {
    throw new InternalServerError("Failed to create expense");
  }

  sendSuccess(res, newExpense, "Expense created successfully", 201);
});

// Controller to Update an Expense
export const updateExpense = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const paramsValidation = updateExpenseParamsSchema.safeParse(req.params);

  if (!paramsValidation.success) {
    throw new ValidationError("Invalid expense ID format");
  }

  const expenseId = paramsValidation.data.id;

  const bodyValidation = updateExpenseBodySchema.safeParse(req.body);

  if (!bodyValidation.success) {
    throw bodyValidation.error;
  }

  const validatedData = bodyValidation.data;

  const expenseExist = await checkIfExpenseExistService(expenseId);

  if (!expenseExist) {
    throw new NotFoundError("Expense with this ID does not exist");
  }

  const updatedExpense = await updateExpenseService({ validatedData, expenseId });

  if (!updatedExpense) {
    throw new InternalServerError("Failed to update expense");
  }

  sendSuccess(res, updatedExpense, "Expense updated successfully", 200);
});

// Controller to get All Expense Categories
export const getAllExpenseCategories = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const expenseCategories = await getAllExpenseCategoriesService();

  if (!expenseCategories) {
    throw new NotFoundError("No expense categories found");
  }

  sendSuccess(res, expenseCategories, "Expense categories retrieved successfully", 200);
});

// Controller to get All Expenses
export const getAllExpenses = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const expenses = await getAllExpensesService();

  if (!expenses) {
    throw new NotFoundError("No expenses found");
  }

  sendSuccess(res, expenses, "Expenses retrieved successfully", 200);
});

// Controller to get an Expense
export const getExpense = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const paramsValidation = getExpenseSchema.safeParse(req.params);

  if (!paramsValidation.success) {
    throw new ValidationError("Invalid expense ID format");
  }

  const expenseId = paramsValidation.data.id;

  const expense = await getExpenseService(expenseId);

  if (!expense) {
    throw new NotFoundError("Expense with this ID does not exist");
  }

  sendSuccess(res, expense, "Expense details retrieved successfully", 200);
});

// Controller to Delete an Expense
export const deleteExpense = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const paramsValidation = deleteExpenseSchema.safeParse(req.params);

  if (!paramsValidation.success) {
    throw new ValidationError("Invalid expense ID format");
  }

  const expenseId = paramsValidation.data.id;

  const existingExpense = await checkIfExpenseExistService(expenseId);

  if (!existingExpense) {
    throw new NotFoundError("Expense with this ID does not exist");
  }

  const deletedExpense = await deleteExpenseService(expenseId);

  if (!deletedExpense) {
    throw new InternalServerError("Failed to delete expense");
  }

  sendSuccess(res, deletedExpense, "Expense deleted successfully", 200);
});

// Controller to Generate Expense Report (No Filters)
export const generateExpenseReport = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  // Fetch ALL expenses (no filters)
  const expenses = await getAllExpensesService();

  if (!expenses || expenses.length === 0) {
    throw new NotFoundError("No expenses found");
  }

  // Calculate summary
  const summary = await calculateExpenseSummary(expenses);

  // Group by category
  const categoryBreakdown = await groupByCategory(expenses);

  // Group by villa
  const villaBreakdown = await groupByVilla(expenses);

  // Generate PDF
  const pdfBuffer = await generateExpenseReportPDF({
    expenses,
    summary,
    categoryBreakdown,
    villaBreakdown
  });

  if (!pdfBuffer) {
    throw new InternalServerError("Failed to generate expense report PDF");
  }

  // Set response headers
  const filename = `Expense_Report_${Date.now()}.pdf`;
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);

  // Send PDF
  res.send(pdfBuffer);
});