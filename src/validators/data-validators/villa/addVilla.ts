import z from 'zod';

export const addVillaSchema = z.object({
    villaName: z.string().min(1, "Villa name is required").max(100, "Villa name must be less than 100 characters"),
    location: z.string().min(1, "Location is required").max(500, "Location must be less than 500 characters"),
    bedRooms: z.number().min(1, "At least 1 bedroom is required").max(20, "Maximum 20 bedrooms allowed"),
    bathRooms: z.number().min(1, "At least 1 bathroom is required").max(20, "Maximum 20 bathrooms allowed"),
    maxGuest: z.number().min(1, "At least 1 guest capacity is required").max(50, "Maximum 50 guests allowed"),
    pricePerNight: z.number().min(0, "Price must be greater than or equal to 0").max(1000000, "Price too high"),
    status: z.enum(["AVAILABLE", "OCCUPIED", "MAINTENANCE"], {
        message: "Status must be one of: AVAILABLE, OCCUPIED, MAINTENANCE"
    }),
    amenities: z.array(z.number().min(1, "Amenity ID must be valid")).min(1, "At least one amenity is required"),
    customAmenities: z.array(z.string().min(1, "Custom amenity cannot be empty")).optional(),
    description: z.string().min(10, "Description must be at least 10 characters").max(1000, "Description must be less than 1000 characters"),
    images: z.array(z.string().refine((val) => {
        try {
            new URL(val);
            return true;
        } 
        catch {
            return false;
        }
    }, "Invalid image URL")).min(1, "At least one image is required").max(30, "Maximum 30 images allowed")
});

export type addVillaData = z.infer<typeof addVillaSchema>;