import z from 'zod';

export const getVillaSchema = z.object({
    id: z.number().int().positive("Villa ID must be a positive integer")
})

export type getVillaData = z.infer<typeof getVillaSchema>;