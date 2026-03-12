import z from "zod";

const GST_MODES = ["NONE", "ALL", "SELECTIVE"] as const;
const BOOKING_SOURCES = ["DIRECT", "AIRBNB", "MAKEMYTRIP", "BOOKING_COM", "GOIBIBO", "AGODA", "OTHER"] as const;

export const createBookingSchema = z.object({
    guestName: z.string().min(1, "Full name is required").max(100, "Guest name must be less than 100 characters"),
    guestEmail: z.string().optional().or(z.literal("")),
    guestPhone: z.string().regex(/^[0-9]{10}$/, "Phone number must be 10 digits"),
    alternatePhone: z.string().regex(/^[0-9]{10}$/, "Phone number must be 10 digits").optional().or(z.literal("")),
    villaId: z.coerce.number().int().positive("Villa is required"),
    checkIn: z.string().refine(val => !isNaN(Date.parse(val)), {
        message: "Invalid check-in date",
    }),
    checkOut: z.string().refine(val => !isNaN(Date.parse(val)), {
        message: "Invalid check-out date",
    }),
    numberOfAdults: z.coerce.number().int().min(1, "At least 1 adult required"),
    numberOfChildren: z.coerce.number().int().min(0, "Children count cannot be negative").default(0),
    specialRequest: z.string().max(500).optional().or(z.literal("")),

    // GST Fields
    gstMode: z.enum(GST_MODES).default("NONE"),
    gstOnBasePrice: z.boolean().default(false),
    gstOnExtraCharge: z.boolean().default(false),
    gstDays: z.coerce.number().int().min(0, "GST days cannot be negative").default(0),

    // Booking Source
    bookingSource: z.enum(BOOKING_SOURCES).optional().nullable(),

    customPrice: z.coerce.number().min(0, "Price cannot be negative").default(0),
    extraPersonCharge: z.coerce.number().min(0, "Extra charge cannot be negative").optional().nullable(),
    discount: z.coerce.number().min(0, "Discount cannot be negative").optional().nullable(),
    advancePaid: z.coerce.number().min(0, "Advance cannot be negative").optional().nullable(),
});

export type createBookingData = z.infer<typeof createBookingSchema>;
