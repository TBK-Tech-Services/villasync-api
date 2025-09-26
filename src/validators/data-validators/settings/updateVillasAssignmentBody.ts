import z from "zod";

export const updateVillaAssignmentBodySchema = z.object({
    villaIds: z.array(z.number().int().positive("Villa ID must be a positive integer"))
        .min(1, "Villa IDs array is required") 
        .max(50, "Cannot assign more than 50 villas")
});

export type updateVillaAssignmentBodyData = z.infer<typeof updateVillaAssignmentBodySchema>;