import z from 'zod';

const GST_MODES = ["NONE", "ALL", "SELECTIVE"] as const;
const BOOKING_SOURCES = ["DIRECT", "AIRBNB", "MAKEMYTRIP", "BOOKING_COM", "GOIBIBO", "AGODA", "OTHER"] as const;

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
    numberOfAdults: z.number().int().min(1, "At least 1 adult required").optional(),
    numberOfChildren: z.number().int().min(0, "Children count cannot be negative").optional(),
    specialRequest: z.string().max(500, "Special request must be less than 500 characters").optional(),

    // GST Fields
    gstMode: z.enum(GST_MODES).optional(),
    gstOnBasePrice: z.boolean().optional(),
    gstOnExtraCharge: z.boolean().optional(),
    gstDays: z.number().int().min(0).optional(),

    // Booking Source
    bookingSource: z.enum(BOOKING_SOURCES).optional().nullable(),

    bookingStatus: z.enum(["CONFIRMED", "CHECKED_IN", "CHECKED_OUT", "CANCELLED"]).optional(),
    paymentStatus: z.enum(["PAID", "PENDING"]).optional(),
});

export type updateBookingBodyData = z.infer<typeof updateBookingBodySchema>;