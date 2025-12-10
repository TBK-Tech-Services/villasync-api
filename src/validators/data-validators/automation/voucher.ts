import z from 'zod';

export const generateVoucherSchema = z.object({
    bookingId: z.string().min(1, 'Booking ID is required'),
});

export type generateVoucherData = z.infer<typeof generateVoucherSchema>;