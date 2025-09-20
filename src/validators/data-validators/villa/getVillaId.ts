import z from "zod";

export const getVillaIdSchema = z.object({
    id: z.string().transform(val => parseInt(val))
});

export type getVillaIdData = z.infer<typeof getVillaIdSchema>;