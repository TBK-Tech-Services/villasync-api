import z from 'zod';

export const requestPasswordResetSchema = z.object({
    email: z
        .string()
        .min(1, "Email is required")
        .refine(
            (val) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val),
            { message: "Please enter a valid email address" }
        )
        .transform((val) => val.toLowerCase().trim()),
});

export type RequestPasswordResetData = z.infer<typeof requestPasswordResetSchema>;
