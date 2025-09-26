import z from "zod";

export const unassignAllVillasParamSchema = z.object({
    ownerId: z.string().transform(val => parseInt(val))
});

export type unassignAllVillasParamData = z.infer<typeof unassignAllVillasParamSchema>;