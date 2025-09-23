import z from "zod";

export const updateBookingStatusParamsSchema = z.object({
    id: z.string().transform(val => parseInt(val))
});

export type updateBookingStatusParamsData = z.infer<typeof updateBookingStatusParamsSchema>;