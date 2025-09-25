import z from "zod";

export const updateGeneralSettingParamSchema = z.object({
    id: z.string().transform(val => parseInt(val))
});

export type updateGeneralSettingParamData = z.infer<typeof updateGeneralSettingParamSchema>;