import z from "zod";

export const updateExpenseParamsSchema = z.object({
    id: z.string().transform(val => parseInt(val))
});

export type updateExpenseParamsData = z.infer<typeof updateExpenseParamsSchema>;