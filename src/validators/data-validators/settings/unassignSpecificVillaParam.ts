import z from "zod";

export const unassignSpecificVillaParamSchema = z.object({
    villaId: z.string().transform(val => parseInt(val)),
    ownerId: z.string().transform(val => parseInt(val))
});

export type unassignSpecificVillaParamData = z.infer<typeof unassignSpecificVillaParamSchema>;
