import { z } from "zod";

export const sendVoucherToAdminsParamsSchema = z.object({
    bookingId: z.string().regex(/^\d+$/, "Invalid booking ID")
});

export type sendVoucherToAdminsParamsData = z.infer<typeof sendVoucherToAdminsParamsSchema>;