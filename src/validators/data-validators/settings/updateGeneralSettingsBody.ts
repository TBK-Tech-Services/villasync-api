import { z } from "zod";

export const updateGeneralSettingBodySchema = z.object({
    businessName: z.string().min(1).max(255).optional(),
    contactEmail: z.string().max(255).optional(),
    phoneNumber: z.string().min(10).max(20).optional(),
    admin1Name: z.string().max(100).optional().nullable(),
    admin1Email: z.string().max(255).optional().nullable(),
    admin1Phone: z.string().max(20).optional().nullable(),
    admin2Name: z.string().max(100).optional().nullable(),
    admin2Email: z.string().max(255).optional().nullable(),
    admin2Phone: z.string().max(20).optional().nullable(),
});

export type updateGeneralSettingBodyData = z.infer<typeof updateGeneralSettingBodySchema>;