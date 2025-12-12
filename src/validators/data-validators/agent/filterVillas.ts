import z from 'zod';

export const filterVillasSchema = z.object({
  checkIn: z.string().optional(),
  checkOut: z.string().optional(),
  guests: z
    .string()
    .transform((val) => parseInt(val, 10))
    .pipe(z.number().int().min(1).max(20))
    .optional(),
  bedrooms: z
    .string()
    .transform((val) => parseInt(val, 10))
    .pipe(z.number().int().min(1).max(10))
    .optional()
});

export type FilterVillasData = z.infer<typeof filterVillasSchema>;