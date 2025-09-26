import z from 'zod';

export const assignVillasToOwnerSchema = z.object({
    ownerId: z.number().int().positive("Owner ID must be a positive integer"),
    villaIds: z.array(z.number().int().positive("Villa ID must be a positive integer"))
        .min(1, "At least one villa must be selected")
        .max(50, "Cannot assign more than 50 villas at once")
});

export type assignVillasToOwnerData = z.infer<typeof assignVillasToOwnerSchema>;