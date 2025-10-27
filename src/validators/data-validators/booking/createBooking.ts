import z from "zod";

export const createBookingSchema = z.object({
    guestName: z.string().min(1, "Full name is required").max(100 , "Guest name must be less than 100 characters"),
    guestEmail: z.string().optional().or(z.literal("")),
    guestPhone: z.string().regex(/^[0-9]{10}$/, "Phone number must be 10 digits"),
    alternatePhone: z.string().regex(/^[0-9]{10}$/, "Phone number must be 10 digits").optional().or(z.literal("")),
    villaId: z.number().int().positive("Villa is required"),
    checkIn: z.string().refine(val => !isNaN(Date.parse(val)), {
        message: "Invalid check-in date",
    }),
    checkOut: z.string().refine(val => !isNaN(Date.parse(val)), {
        message: "Invalid check-out date",
    }),
    totalGuests: z.number().int().positive("At least 1 guest required"),
    specialRequest: z.string().max(500).optional().or(z.literal("")),
    isGSTIncluded: z.boolean().default(false),
    customPrice: z.number().min(0, "Price cannot be negative").optional().nullable(),
    extraPersonCharge: z.number().min(0, "Extra charge cannot be negative").optional().nullable(),
    discount: z.number().min(0, "Discount cannot be negative").optional().nullable(),
    advancePaid: z.number().min(0, "Advance cannot be negative").optional().nullable(),
});

export type createBookingData = z.infer<typeof createBookingSchema>; 