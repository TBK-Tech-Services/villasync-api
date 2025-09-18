import z from "zod";

export const searchAndFilterVillasSchema = z.object({
    checkInDate: z.string().min(1, "Check-in date is required")
        .refine((date) => {
            const checkIn = new Date(date);
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            return checkIn >= today;
        }, "Check-in date must be today or in the future"),
    checkOutDate: z.string().min(1, "Check-out date is required")
        .refine((date) => {
            !isNaN(Date.parse(date))
        }, "Invalid check-out date format"),
    totalGuest: z.number().int("Total guests must be a whole number").min(1, "At least 1 guest is required").max(30, "Maximum 30 guests allowed"),
    selectedAmenities: z.array(z.number().int().positive()).optional().default([])
})
.refine((data) => {
    const checkIn = new Date(data.checkInDate);
    const checkOut = new Date(data.checkOutDate);
    return checkOut > checkIn;
}, 
{
    message: "Check-out date must be after check-in date",
    path: ["checkOutDate"]
});

export type searchAndFilterVillasData = z.infer<typeof searchAndFilterVillasSchema>;