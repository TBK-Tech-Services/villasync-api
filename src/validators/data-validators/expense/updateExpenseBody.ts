import z from 'zod';

const categorySchema = z.union([
  z.number().positive(), 
  z.string().min(1).max(50)
]);

export const updateExpenseBodySchema = z.discriminatedUnion('expenseType', [
  z.object({
    expenseType: z.literal('INDIVIDUAL'),
    title: z.string().min(1, "Title is required").max(100, "Title too long"),
    amount: z.number().positive("Amount must be positive"),
    date: z.string(),
    category: categorySchema,
    villaId: z.number().positive("Valid villa required")
  }),
  
  z.object({
    expenseType: z.literal('SPLIT'),
    title: z.string().min(1, "Title is required").max(100, "Title too long"),
    amount: z.number().positive("Amount must be positive"),
    date: z.string(),
    category: categorySchema,
    villaIds: z.array(z.number().positive()).min(1, "Select at least one villa")
  })
]);

export type updateExpenseBodyData = z.infer<typeof updateExpenseBodySchema>;