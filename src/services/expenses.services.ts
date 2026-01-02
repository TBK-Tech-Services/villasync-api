import puppeteer from 'puppeteer';
import type { Expense_Type } from "@prisma/client";
import prisma from "../db/DB.ts";
import type { addExpenseData } from "../validators/data-validators/expense/addExpense.ts";
import type { updateExpenseBodyData } from "../validators/data-validators/expense/updateExpenseBody.ts";
import { InternalServerError } from "../utils/errors/customErrors.ts";
import { createExpenseReportHTML } from '../templates/expenseReport.template.ts';
import type { ExpenseReportFiltersData } from '../validators/data-validators/expense/expenseReportFilters.ts';

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
export async function updateExpenseService({ validatedData, expenseId }: { validatedData: updateExpenseBodyData, expenseId: number }): Promise<any | null> {
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

// Service to Get Filtered Expenses
export async function getFilteredExpensesService(filters: ExpenseReportFiltersData): Promise<any | null> {
    try {
        const whereClause: any = {};

        // Date filtering logic
        if (filters.month) {
            // Month format: "2025-11"
            const [year, month] = filters.month.split('-').map(Number);
            const startOfMonth = new Date(year, month - 1, 1);
            const endOfMonth = new Date(year, month, 0, 23, 59, 59, 999);

            whereClause.date = {
                gte: startOfMonth,
                lte: endOfMonth
            };
        } else if (filters.startDate || filters.endDate) {
            whereClause.date = {};

            if (filters.startDate) {
                whereClause.date.gte = new Date(filters.startDate);
            }

            if (filters.endDate) {
                const endDate = new Date(filters.endDate);
                endDate.setHours(23, 59, 59, 999);
                whereClause.date.lte = endDate;
            }
        }

        // Category filter
        if (filters.categoryId) {
            whereClause.categoryId = filters.categoryId;
        }

        // Type filter
        if (filters.type) {
            whereClause.type = filters.type;
        }

        // Villa filter - handles both INDIVIDUAL and SPLIT expenses
        if (filters.villaId) {
            whereClause.OR = [
                { villaId: filters.villaId },
                {
                    villas: {
                        some: {
                            villaId: filters.villaId
                        }
                    }
                }
            ];
        }

        const expenses = await prisma.expense.findMany({
            where: whereClause,
            include: {
                category: true,
                villa: true,
                villas: {
                    include: {
                        villa: true
                    }
                }
            },
            orderBy: { date: 'desc' }
        });

        return expenses;
    }
    catch (error) {
        console.error(`Error fetching filtered expenses: ${error}`);
        throw new InternalServerError("Failed to fetch filtered expenses");
    }
}

// Service to Calculate Expense Summary
export async function calculateExpenseSummary(expenses: any): Promise<any | null> {
    try {
        const totalAmount = expenses.reduce((sum: number, exp: any) => sum + exp.amount, 0);

        const uniqueVillas = new Set();
        expenses.forEach((exp: any) => {
            if (exp.villaId) {
                uniqueVillas.add(exp.villaId);
            }
            if (exp.villas && exp.villas.length > 0) {
                exp.villas.forEach((v: any) => uniqueVillas.add(v.villaId));
            }
        });

        const uniqueCategories = new Set(expenses.map((e: any) => e.categoryId));

        return {
            totalExpenses: totalAmount,
            expenseCount: expenses.length,
            villaCount: uniqueVillas.size,
            categoryCount: uniqueCategories.size,
            averageExpense: expenses.length > 0 ? Math.round(totalAmount / expenses.length) : 0
        };
    }
    catch (error) {
        console.error(`Error calculating expense summary: ${error}`);
        throw new InternalServerError("Failed to calculate expense summary");
    }
}

// Service to Group Expenses by Category
export async function groupByCategory(expenses: any): Promise<any | null> {
    try {
        const grouped: any = {};

        expenses.forEach((exp: any) => {
            const category = exp.category.name;
            if (!grouped[category]) {
                grouped[category] = {
                    name: category,
                    amount: 0,
                    count: 0
                };
            }
            grouped[category].amount += exp.amount;
            grouped[category].count += 1;
        });

        // Calculate percentages
        const total = Object.values(grouped).reduce((sum: number, g: any) => sum + g.amount, 0);

        const result = Object.values(grouped).map((g: any) => ({
            ...g,
            percentage: total > 0 ? ((g.amount / total) * 100).toFixed(1) : '0.0'
        }));

        // Sort by amount descending
        result.sort((a: any, b: any) => b.amount - a.amount);

        return result;
    }
    catch (error) {
        console.error(`Error grouping by category: ${error}`);
        throw new InternalServerError("Failed to group expenses by category");
    }
}

// Service to Group Expenses by Villa
export async function groupByVilla(expenses: any): Promise<any | null> {
    try {
        const villaMap = new Map();

        expenses.forEach((exp: any) => {
            if (exp.type === 'INDIVIDUAL' && exp.villa) {
                const villaName = exp.villa.name;
                if (!villaMap.has(villaName)) {
                    villaMap.set(villaName, { name: villaName, amount: 0, count: 0 });
                }
                const villa = villaMap.get(villaName);
                villa.amount += exp.amount;
                villa.count += 1;
            }
            else if (exp.type === 'SPLIT' && exp.villas && exp.villas.length > 0) {
                exp.villas.forEach((v: any) => {
                    const villaName = v.villa.name;
                    if (!villaMap.has(villaName)) {
                        villaMap.set(villaName, { name: villaName, amount: 0, count: 0 });
                    }
                    const villa = villaMap.get(villaName);
                    villa.amount += v.amount;
                    villa.count += 1;
                });
            }
        });

        const result = Array.from(villaMap.values());

        // Sort by amount descending
        result.sort((a: any, b: any) => b.amount - a.amount);

        return result;
    }
    catch (error) {
        console.error(`Error grouping by villa: ${error}`);
        throw new InternalServerError("Failed to group expenses by villa");
    }
}

// Service to Generate Expense Report PDF
export async function generateExpenseReportPDF(data: any): Promise<any | null> {
    try {
        // Create HTML from template
        const html = createExpenseReportHTML(data);

        // Launch Puppeteer
        const browser = await puppeteer.launch({
            headless: true,
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });

        const page = await browser.newPage();

        // Set content
        await page.setContent(html, { waitUntil: 'networkidle0' });

        // Generate PDF
        const pdfBuffer = await page.pdf({
            format: 'A4',
            printBackground: true,
            margin: {
                top: '20mm',
                right: '15mm',
                bottom: '20mm',
                left: '15mm'
            }
        });

        await browser.close();

        return pdfBuffer;
    }
    catch (error) {
        console.error(`Error generating expense report PDF: ${error}`);
        throw new InternalServerError("Failed to generate expense report PDF");
    }
}