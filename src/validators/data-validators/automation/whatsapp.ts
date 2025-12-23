import z from 'zod';

export const sendVoucherWhatsappSchema = z.object({
    phoneNumber: z
        .string()
        .min(10, 'Phone number must be at least 10 digits')
        .max(20, 'Phone number must not exceed 20 digits')
        .regex(/^[\+]?[0-9\s\-\(\)]+$/, 'Invalid phone number format'),
    message: z
        .string()
        .optional()
        .default('Your booking voucher is ready!'),
    voucherUrl: z
        .string()
        .min(1, 'Voucher URL is required')
});

export type sendVoucherWhatsappData = z.infer<typeof sendVoucherWhatsappSchema>;