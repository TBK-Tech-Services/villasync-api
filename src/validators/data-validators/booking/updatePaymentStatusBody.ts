import z from "zod";

export const updatePaymentStatusBodySchema = z.object({
    paymentStatus: z.enum(["PENDING", "PAID"])
});

export type updatePaymentStatusBodyData = z.infer<typeof updatePaymentStatusBodySchema>;