import z from "zod";

export const deleteExpenseSchema = z.object({
    id: z.string().transform(val => parseInt(val))
});

export type deleteExpenseData = z.infer<typeof deleteExpenseSchema>; 