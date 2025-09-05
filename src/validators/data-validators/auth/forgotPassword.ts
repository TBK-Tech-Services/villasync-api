import z from 'zod';

export const forgotPasswordSchema = z
    .object({
        newPassword : z.string().min(8, "Password must be at least 8 characters"),
        confirmPassword : z.string().min(8, "Confirm Password must be at least 8 characters")
    })
    .refine((data) => data.newPassword === data.confirmPassword , {
        message: "Passwords do not match",
        path: ["confirmPassword"]
    });

export type ForgotPasswordData = z.infer<typeof forgotPasswordSchema>;