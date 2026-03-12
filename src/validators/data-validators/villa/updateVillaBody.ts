import z from 'zod';

export const updateVillaBodySchema = z.object({
    villaName: z.string().min(1).max(100).optional(),
    location: z.string().min(1).max(500).optional(),
    bedRooms: z.number().min(1).max(20).optional(),
    bathRooms: z.number().min(1).max(20).optional(),
    status: z.enum(["AVAILABLE", "OCCUPIED", "MAINTENANCE"]).optional(),
    description: z.string().min(10).max(1000).optional(),
    amenities: z.array(z.number().min(1)).optional(),
    imageUrl: z.string().max(500, "Image URL must be less than 500 characters"), 
});

export type updateVillaBodyData = z.infer<typeof updateVillaBodySchema>;