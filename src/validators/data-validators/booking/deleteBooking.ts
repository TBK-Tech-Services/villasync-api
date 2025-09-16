import z from "zod";

export const deleteBookingSchema = z.object({
    id: z.string().transform(val => parseInt(val))
});

export type deleteBookingData = z.infer<typeof deleteBookingSchema>; 