import type { Expense_Type } from "@prisma/client";
import prisma from "../db/DB.ts";
import type { addExpenseData } from "../validators/data-validators/expense/addExpense.ts";
import type { updateExpenseBodyData } from "../validators/data-validators/expense/updateExpenseBody.ts";
import { InternalServerError } from "../utils/errors/customErrors.ts";

// Service to Add An Expense
export async function addExpenseService(validatedData: addExpenseData): Promise<any | null> {
    try {
        const result = await prisma.$transaction(async (tx) => {
            let categoryId: number;

            if (typeof validatedData.category === "number") {
                categoryId = validatedData.category;
            } else {
                const newCategory = await tx.expenseCategory.create({
                    data: {
                        name: validatedData.category
                    }
                });

                categoryId = newCategory.id;
            }

            const amountInPaise = (validatedData.amount * 100);

            const expenseData = {
                title: validatedData.title,
                amount: amountInPaise,
                date: new Date(validatedData.date),
                type: validatedData.expenseType as Expense_Type,
                categoryId: categoryId,
                villaId: validatedData.expenseType === 'INDIVIDUAL' 
                    ? validatedData.villaId 
                    : null
            };

            const newExpense = await tx.expense.create({
                data: expenseData,
                include: {
                    category: true,
                    villa: true,
                }
            });

            if (validatedData.expenseType === 'SPLIT') {
                const amountPerVillaInPaise = (amountInPaise / validatedData.villaIds.length);

                for (const villaId of validatedData.villaIds) {
                    await tx.expenseVilla.create({
                        data: {
                            expenseId: newExpense.id,
                            villaId: villaId,
                            amount: Math.round(amountPerVillaInPaise)
                        }
                    });
                }
            }

            const completeExpense = await tx.expense.findUnique({
                where: { 
                    id: newExpense.id 
                },
                include: {
                    category: true,
                    villa: true,
                    villas: {
                        include: {
                            villa: true
                        }
                    }
                }
            });

            return completeExpense;
        });

        return result;
    }
    catch (error) { 
        console.error(`Error adding new expense: ${error}`);
        throw new InternalServerError("Failed to create expense");
    }
}

// Service to Check If Expense Exists
export async function checkIfExpenseExistService(expenseId: number): Promise<any | null> {
    try {
        const expense = await prisma.expense.findUnique({
            where: {
                id: expenseId
            }
        });

        return expense;
    } 
    catch (error) { 
        console.error(`Error checking expense existence: ${error}`);
        throw new InternalServerError("Failed to verify expense existence");
    }
}

// Service to Update an Expense
export async function updateExpenseService({validatedData, expenseId}: {validatedData: updateExpenseBodyData, expenseId: number}): Promise<any | null> {
    try {
        const result = await prisma.$transaction(async (tx) => {
            // FIXED: Use tx instead of calling external function
            const existingExpense = await tx.expense.findUnique({
                where: {
                    id: expenseId
                }
            });

            let categoryId: number;

            if (typeof validatedData.category === "number") {
                categoryId = validatedData.category;
            } else {
                const newCategory = await tx.expenseCategory.create({
                    data: {
                        name: validatedData.category
                    }
                });

                categoryId = newCategory.id;
            }

            const amountInPaise = (validatedData.amount * 100);

            if (existingExpense?.type === 'SPLIT') {
                await tx.expenseVilla.deleteMany({
                    where: { 
                        expenseId: expenseId 
                    }
                });
            }

            const expenseData = {
                title: validatedData.title,
                amount: amountInPaise,
                date: new Date(validatedData.date),
                type: validatedData.expenseType as Expense_Type,
                categoryId: categoryId,
                villaId: validatedData.expenseType === 'INDIVIDUAL' 
                    ? validatedData.villaId 
                    : null
            };

            const updatedExpense = await tx.expense.update({
                where: {
                    id: expenseId
                },
                data: expenseData,
                include: {
                    category: true,
                    villa: true,
                }
            });

            if (validatedData.expenseType === 'SPLIT') {
                const amountPerVillaInPaise = (amountInPaise / validatedData.villaIds.length);

                for (const villaId of validatedData.villaIds) {
                    await tx.expenseVilla.create({
                        data: {
                            expenseId: updatedExpense.id,
                            villaId: villaId,
                            amount: Math.round(amountPerVillaInPaise)
                        }
                    });
                }
            }

            const completeExpense = await tx.expense.findUnique({
                where: { id: expenseId },
                include: {
                    category: true,
                    villa: true,
                    villas: {
                        include: {
                            villa: true
                        }
                    }
                }
            });

            return completeExpense;
        });

        return result;
    } 
    catch (error) { 
        console.error(`Error updating expense: ${error}`);
        throw new InternalServerError("Failed to update expense");
    }
}

// Service to get All Categories for Expense
export async function getAllExpenseCategoriesService(): Promise<any | null> {
    try {
        const expenseCategories = await prisma.expenseCategory.findMany();

        return expenseCategories;
    } 
    catch (error) { 
        console.error(`Error getting expense categories: ${error}`);
        throw new InternalServerError("Failed to fetch expense categories");
    }
}

// Service to get All Expenses
export async function getAllExpensesService(): Promise<any | null> {
    try {
        const expenses = await prisma.expense.findMany({
            include: {
                category: true,
                villa: true, 
                villas: {
                    include: {
                        villa: true
                    }
                }
            }
        });

        return expenses;
    } 
    catch (error) { 
        console.error(`Error getting all expenses: ${error}`);
        throw new InternalServerError("Failed to fetch expenses");
    }
}

// Service to get an Expense
export async function getExpenseService(expenseId: number): Promise<any | null> {
    try {
        const expense = await prisma.expense.findUnique({
            where: {
                id: expenseId
            },
            include: {
                category: true,
                villa: true,
                villas: {
                    include: {
                        villa: true
                    }
                }
            }
        });

        return expense;
    } 
    catch (error) { 
        console.error(`Error getting expense: ${error}`);
        throw new InternalServerError("Failed to fetch expense details");
    }
}

// Service to Delete an Expense
export async function deleteExpenseService(expenseId: number): Promise<any | null> {
    try {
        const deletedExpense = await prisma.expense.delete({
            where: {
                id: expenseId
            }
        });

        return deletedExpense;
    } 
    catch (error) { 
        console.error(`Error deleting expense: ${error}`);
        throw new InternalServerError("Failed to delete expense");
    }
}