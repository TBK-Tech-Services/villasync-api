import z from "zod";

export const getBookingSchema = z.object({
    id: z.string().transform(val => parseInt(val))
});

export type getBookingData = z.infer<typeof getBookingSchema>;