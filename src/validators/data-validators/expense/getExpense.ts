import z from "zod";

export const getExpenseSchema = z.object({
    id: z.string().transform(val => parseInt(val))
});

export type getExpenseData = z.infer<typeof getExpenseSchema>;