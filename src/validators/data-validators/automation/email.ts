import z from 'zod';

export const sendVoucherEmailSchema = z.object({
    email: z.string().refine(
        (val) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val),
        { message: 'Invalid email format' }
    ),
    message: z.string().max(1000, 'Message must be less than 1000 characters'),
    voucherUrl: z.string().refine(
        (val) => {
            try {
                new URL(val);
                return true;
            } catch {
                return false;
            }
        },
        { message: 'Invalid URL format' }
    )
});

export type sendVoucherEmailData = z.infer<typeof sendVoucherEmailSchema>;