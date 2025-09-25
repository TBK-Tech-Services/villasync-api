import z from 'zod';

export const updateGeneralSettingBodySchema = z.object({
    businessName: z.string().min(1, "Business name is required").max(100, "Business name too long").optional(),
    contactEmail: z.string().min(1, "Contact email is required").max(100, "Email too long").optional(),
    phoneNumber: z.string().min(1, "Phone number is required").max(20, "Phone number too long").optional(),
});

export type updateGeneralSettingBodyData = z.infer<typeof updateGeneralSettingBodySchema>;