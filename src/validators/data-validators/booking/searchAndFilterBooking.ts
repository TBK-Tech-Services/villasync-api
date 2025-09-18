import z from "zod";

export const searchAndFilterBookingSchema = z.object({
  searchText: z.string().optional().or(z.literal("")),
  status: z.enum(["CONFIRMED", "CHECKED_IN", "CHECKED_OUT", "CANCELLED"]).optional().or(z.literal("")),
});

export type searchAndFilterBookingData = z.infer<typeof searchAndFilterBookingSchema>;
