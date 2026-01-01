import { z } from "zod";

export const updateVoucherApprovalParamsSchema = z.object({
    id: z.string().regex(/^\d+$/, "Invalid booking ID").transform(Number)
});

export const updateVoucherApprovalBodySchema = z.object({
    approvedBy: z.enum(["PUJA", "JAIRAJ"])
});

export type updateVoucherApprovalBodyData = z.infer<typeof updateVoucherApprovalBodySchema>;