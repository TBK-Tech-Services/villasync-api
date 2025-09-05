import z from 'zod';

export const changePasswordSchema = z
    .object({
        currentPassword : z.string().min(8, "Password must be at least 8 characters"),
        newPassword : z.string().min(8, "Password must be at least 8 characters"),
        confirmPassword : z.string().min(8, "Confirm Password must be at least 8 characters")
    })
    .refine((data) => data.newPassword === data.confirmPassword , {
        message: "Passwords do not match",
        path: ["confirmPassword"]
    })
    .refine((data) => data.newPassword !== data.currentPassword , {
        message: "New Password must be different from current password",
        path: ["newPassword"]
    })

export type ChangePasswordData = z.infer<typeof changePasswordSchema>;