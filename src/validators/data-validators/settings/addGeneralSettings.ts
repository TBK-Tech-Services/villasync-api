import { z } from "zod";

export const addGeneralSettingsSchema = z.object({
    businessName: z.string().min(1, "Business name is required").max(255),
    contactEmail: z.string().max(255),
    phoneNumber: z.string().min(10, "Phone number must be at least 10 digits").max(20),

    admin1Name: z.string().max(100).optional(),
    admin1Email: z.string().optional(),
    admin1Phone: z.string().max(20).optional(),

    admin2Name: z.string().max(100).optional(),
    admin2Email: z.string().optional(),
    admin2Phone: z.string().max(20).optional(),
});

export type addGeneralSettingsData = z.infer<typeof addGeneralSettingsSchema>;