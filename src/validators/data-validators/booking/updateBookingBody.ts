import z from 'zod';

export const updateBookingBodySchema = z.object({
    guestName: z.string().min(1, "Guest name is required").max(100, "Guest name must be less than 100 characters").optional(),
    guestEmail: z.string().optional(),
    guestPhone: z.string().length(10, "Phone number must be 10 digits").optional(),
    villaId: z.number().int().positive("Villa ID must be positive").optional(),
    checkIn: z.string().refine(val => !isNaN(Date.parse(val)), {
        message: "Invalid check-in date",
    }).optional(),
    checkOut: z.string().refine(val => !isNaN(Date.parse(val)), {
        message: "Invalid check-out date",
    }).optional(),
    totalGuests: z.number().int().positive("At least 1 guest required").optional(),
    specialRequest: z.string().max(500, "Special request must be less than 500 characters").optional(),
    isGSTIncluded: z.boolean().optional(),
    bookingStatus: z.enum(["CONFIRMED", "CHECKED_IN", "CHECKED_OUT", "CANCELLED"]).optional(),
    paymentStatus: z.enum(["PAID", "PENDING"]).optional(),
});

export type updateBookingBodyData = z.infer<typeof updateBookingBodySchema>;