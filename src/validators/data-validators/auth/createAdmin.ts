import z from 'zod';

export const createAdminSchema = z.object({
    firstName: z.string().min(1, "First name is required").max(50),
    lastName: z.string().min(1, "Last name is required").max(50),
    email: z.string(),
    password: z.string().min(8, "Password must be at least 8 characters"),
    role: z.string().min(1, "Role is required").max(20)
});

export type createAdminData = z.infer<typeof createAdminSchema>;