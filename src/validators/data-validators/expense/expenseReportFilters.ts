import z from "zod";

export const expenseReportFiltersSchema = z.object({
    startDate: z.string().optional(),
    endDate: z.string().optional(),
    month: z.string().optional(), // Format: "2025-11" (YYYY-MM)
    categoryId: z.string().transform(val => parseInt(val)).optional(),
    type: z.enum(["INDIVIDUAL", "SPLIT"]).optional(),
    villaId: z.string().transform(val => parseInt(val)).optional(),
});

export type ExpenseReportFiltersData = z.infer<typeof expenseReportFiltersSchema>;