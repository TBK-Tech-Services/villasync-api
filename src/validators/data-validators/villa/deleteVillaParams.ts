import z from "zod";

export const deleteVillaParamsSchema = z.object({
    id: z.string().transform(val => parseInt(val))
});

export type deleteVillaParamsData = z.infer<typeof deleteVillaParamsSchema>;