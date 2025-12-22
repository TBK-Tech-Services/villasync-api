import z from 'zod';

export const sendVoucherWhatsappSchema = z.object({
    phoneNumber: z
        .string()
        .min(10, 'Phone number must be at least 10 digits')
        .max(15, 'Phone number must not exceed 15 digits')
        .regex(/^(\+?\d{1,3}[-.\s]?)?\d{10,14}$/, 'Invalid phone number format'),
    message: z
        .string()
        .optional()
        .default('Your booking voucher is ready!'),
    voucherUrl: z
        .string()
        .min(1, 'Voucher URL is required')
});

export type sendVoucherWhatsappData = z.infer<typeof sendVoucherWhatsappSchema>;