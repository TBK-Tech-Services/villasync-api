import z from "zod";

export const getCalendarBookingsSchema = z.object({
    villaId: z.coerce.number().int().positive().optional(),
    month: z.coerce.number().int().min(1, "Month must be between 1-12").max(12, "Month must be between 1-12"),
    year: z.coerce.number().int().min(2020, "Year must be 2020 or later").max(2100, "Year must be before 2100")
});

export type getCalendarBookingsData = z.infer<typeof getCalendarBookingsSchema>;