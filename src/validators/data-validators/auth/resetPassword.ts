import z from 'zod';

export const resetPasswordSchema = z
    .object({
        email: z
            .string()
            .min(1, "Email is required")
            .refine(
                (val) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val),
                { message: "Please enter a valid email address" }
            )
            .transform((val) => val.toLowerCase().trim()),
        otp: z
            .string()
            .length(6, "OTP must be exactly 6 digits")
            .regex(/^\d{6}$/, "OTP must contain only digits"),
        newPassword: z.string().min(8, "Password must be at least 8 characters"),
        confirmPassword: z.string().min(8, "Confirm Password must be at least 8 characters"),
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
        message: "Passwords do not match",
        path: ["confirmPassword"],
    });

export type ResetPasswordData = z.infer<typeof resetPasswordSchema>;
