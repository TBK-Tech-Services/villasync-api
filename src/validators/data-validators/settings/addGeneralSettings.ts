import z from 'zod';

export const addGeneralSettingsSchema = z.object({
    businessName: z.string().min(1, "Business name is required").max(100, "Business name too long"),
    contactEmail: z.string().min(1, "Contact email is required").max(100, "Email too long"),
    phoneNumber: z.string().min(1, "Phone number is required").max(20, "Phone number too long"),
});

export type addGeneralSettingsData = z.infer<typeof addGeneralSettingsSchema>;