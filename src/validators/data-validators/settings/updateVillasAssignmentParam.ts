import z from "zod";

export const updateVillaAssignmentParamSchema = z.object({
    ownerId: z.string().transform(val => parseInt(val))
});

export type updateVillaAssignmentParamData = z.infer<typeof updateVillaAssignmentParamSchema>;