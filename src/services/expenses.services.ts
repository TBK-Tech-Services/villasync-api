import type { Expense_Type } from "@prisma/client";
import prisma from "../db/DB.ts";
import type { addExpenseData } from "../validators/data-validators/expense/addExpense.ts";
import type { updateExpenseBodyData } from "../validators/data-validators/expense/updateExpenseBody.ts";
  
// Service to Add An Expense
export async function addExpenseService(validatedData: addExpenseData): Promise<any | null> {
  try {
    const result = await prisma.$transaction(async (tx) => {
      let categoryId: number;

      if(typeof validatedData.category === "number"){
        categoryId = validatedData.category;
      }
      else {
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

        if(validatedData.expenseType === 'SPLIT'){
            const amountPerVillaInPaise = (amountInPaise / validatedData.villaIds.length);
    
            for(const villaId of validatedData.villaIds){
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
    const message = error instanceof Error ? (error.message) : String(error);
    console.error(`Error adding new expense : ${message}`);
    throw new Error(`Error adding new expense : ${message}`);
  }
}
  
// Service to Update an Expense
export async function checkIfExpenseExistService(expenseId: number): Promise<any | null> {
    try {
      const expense = await prisma.expense.findUnique({
        where : {
          id : expenseId
        }
      });

      return expense;
    } 
    catch (error) { 
      const message = error instanceof Error ? (error.message) : String(error);
      console.error(`Error checking expense existance : ${message}`);
      throw new Error(`Error checking expense existance : ${message}`);
    }
}

// Service to Update an Expense
export async function updateExpenseService({validatedData , expenseId}: {validatedData: updateExpenseBodyData , expenseId: number}): Promise<any | null> {
    try {
      const result = await prisma.$transaction(async (tx) => {
        const existingExpense = await checkIfExpenseExistService(expenseId);

        let categoryId: number;

        if(typeof validatedData.category === "number"){
          categoryId = validatedData.category;
        }
        else {
          const newCategory = await tx.expenseCategory.create({
            data: {
              name: validatedData.category
            }
          });

          categoryId = newCategory.id; 
        }

        const amountInPaise = (validatedData.amount * 100);

        if (existingExpense.type === 'SPLIT') {
          await tx.expenseVilla.deleteMany({
            where: { 
              expenseId: expenseId 
            }
          });
        };

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
      const message = error instanceof Error ? (error.message) : String(error);
      console.error(`Error updating an expense : ${message}`);
      throw new Error(`Error updating an expense : ${message}`);
    }
}

// Service to Delete an Expense
export async function deleteExpenseService(): Promise<void> {
    try {

    } 
    catch (error) { 
        console.error(error); 
    }
}
  
// Service to get All Expenses
export async function getAllExpensesService(): Promise<void> {
    try {

    } 
    catch (error) { 
        console.error(error); 
    }
}

// Service to get All Villas For Expenses
export async function getAllVillasForExpensesService(): Promise<void> {
    try {

    } 
    catch (error) { 
        console.error(error); 
    }
}