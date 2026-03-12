import z from 'zod';

export const addVillaSchema = z.object({
    villaName: z.string().min(1, "Villa name is required").max(100, "Villa name must be less than 100 characters"),
    location: z.string().min(1, "Location is required").max(500, "Location must be less than 500 characters"),
    bedRooms: z.number().min(1, "At least 1 bedroom is required").max(20, "Maximum 20 bedrooms allowed"),
    bathRooms: z.number().min(1, "At least 1 bathroom is required").max(20, "Maximum 20 bathrooms allowed"),
    status: z.enum(["AVAILABLE", "OCCUPIED", "MAINTENANCE"], {
        message: "Status must be one of: AVAILABLE, OCCUPIED, MAINTENANCE"
    }),
    amenities: z.array(z.number().min(1, "Amenity ID must be valid")).min(1, "At least one amenity is required"),
    description: z.string().min(10, "Description must be at least 10 characters").max(1000, "Description must be less than 1000 characters"),
    imageUrl: z.string().max(500, "Image URL must be less than 500 characters"), 
});

export type addVillaData = z.infer<typeof addVillaSchema>;