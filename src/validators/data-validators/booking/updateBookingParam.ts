import z from "zod";

export const updateBookingParamsSchema = z.object({
    id: z.string().transform(val => parseInt(val))
});

export type updateBookingParamsData = z.infer<typeof updateBookingParamsSchema>;