import z from "zod";

export const updateBookingStatusBodySchema = z.object({
    bookingStatus: z.enum(["CONFIRMED", "CHECKED_IN", "CHECKED_OUT" , "CANCELLED"])
});

export type updateBookingStatusBodyData = z.infer<typeof updateBookingStatusBodySchema>;