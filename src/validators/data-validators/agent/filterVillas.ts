import z from 'zod';

export const filterVillasSchema = z.object({
  checkIn: z.string().optional(),
  checkOut: z.string().optional(),
  guests: z
    .string()
    .transform((val) => parseInt(val, 10))
    .pipe(z.number().int().min(1).max(20))
    .optional(),
  amenities: z
    .string()
    .transform((val) => val.split(',').map(item => parseInt(item.trim(), 10)).filter(id => !isNaN(id)))
    .optional()
});

export type FilterVillasData = z.infer<typeof filterVillasSchema>;