import z from "zod";

export const updateVillaParamsSchema = z.object({
    id: z.string().transform(val => parseInt(val))
});

export type updateVillaParamsData = z.infer<typeof updateVillaParamsSchema>;