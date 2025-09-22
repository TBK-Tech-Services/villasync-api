import z from "zod";

export const getFinanceQueryParamsSchema = z.object({
    villaId: z.string()
        .optional()
        .transform(val => val ? parseInt(val) : undefined)
        .refine(val => val === undefined || (!isNaN(val) && val > 0), {
            message: "Villa ID must be a positive integer"
        }),
    month: z.string()
        .optional()
        .transform(val => val ? parseInt(val) : undefined)
        .refine(val => val === undefined || (!isNaN(val) && val >= 1 && val <= 12), {
            message: "Month must be between 1 and 12"
        }),
    startDate: z.string()
        .optional()
        .refine(val => val === undefined || !isNaN(Date.parse(val)), {
            message: "Start date must be in valid date format (YYYY-MM-DD)"
        })
        .transform(val => val ? new Date(val) : undefined),
    endDate: z.string()
        .optional()
        .refine(val => val === undefined || !isNaN(Date.parse(val)), {
            message: "End date must be in valid date format (YYYY-MM-DD)"
        })
        .transform(val => val ? new Date(val) : undefined)
})
.refine(data => {
    if (data.startDate && data.endDate) {
        return data.endDate > data.startDate;
    }
    
    return true;
}, {
    message: "End date must be after start date",
    path: ["endDate"]
})
.refine(data => {
    if (data.month && (data.startDate || data.endDate)) {
        return false;
    }
    
    return true;
}, {
    message: "Cannot use month filter with custom date range",
    path: ["month"]
});

export type getFinanceQueryParamsData = z.infer<typeof getFinanceQueryParamsSchema>;