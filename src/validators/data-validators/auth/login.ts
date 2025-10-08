import z from 'zod';

export const loginSchema = z.object({
        email: z
                .string()
                .min(1, "Email is required")
                .refine(
                        (val) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val),
                        { message: "Please enter a valid email address" }
                )
                .transform((val) => val.toLowerCase().trim()),
        password: z
                .string()
                .min(1, "Password is required")
                .min(8, "Password must be at least 8 characters"),
});

export type LoginData = z.infer<typeof loginSchema>;