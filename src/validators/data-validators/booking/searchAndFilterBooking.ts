import z from "zod";

export const searchAndFilterBookingSchema = z.object({
  searchText: z.string().min(1).optional(), 
  status: z.enum(["CONFIRMED", "CHECKED_IN", "CHECKED_OUT", "CANCELLED"]).optional(),
});

export type searchAndFilterBookingData = z.infer<typeof searchAndFilterBookingSchema>;