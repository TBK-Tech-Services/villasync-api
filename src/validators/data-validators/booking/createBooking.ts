import z from "zod";

export const createBookingSchema = z.object({
    guestName: z.string().min(1, "Full name is required").max(100 , "Guest name must be less than 100 characters"),
    guestEmail: z.string(),
    guestPhone: z.string().length(10, "Phone number must be 10 digits"),
    villaId: z.number().int().positive("Villa is required"),
    checkIn: z.string().refine(val => !isNaN(Date.parse(val)), {
        message: "Invalid check-in date",
    }),
    checkOut: z.string().refine(val => !isNaN(Date.parse(val)), {
        message: "Invalid check-out date",
    }),
    totalGuests: z.number().int().positive("At least 1 guest required"),
    specialRequest: z.string().max(500).optional(),
    subTotalAmount: z.number().int().nonnegative(),
    isGSTIncluded: z.boolean().default(false),
    totalTax: z.number().int().nonnegative().default(0),
    totalPayableAmount: z.number().int().nonnegative(),
});

export type createBookingData = z.infer<typeof createBookingSchema>;