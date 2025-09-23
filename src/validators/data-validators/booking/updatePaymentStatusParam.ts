import z from "zod";

export const updatePaymentStatusParamsSchema = z.object({
    id: z.string().transform(val => parseInt(val))
});

export type updatePaymentStatusParamsData = z.infer<typeof updatePaymentStatusParamsSchema>;