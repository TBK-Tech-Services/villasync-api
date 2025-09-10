import z from 'zod';

export const createUserSchema = z.object({
    firstName: z.string().min(1, "First name is required").max(50),
    lastName: z.string().min(1, "Last name is required").max(50),
    email: z.string(),
    password: z.string().min(8, "Password must be at least 8 characters"),
    roleId: z.number()
});

export type createUserData = z.infer<typeof createUserSchema>;