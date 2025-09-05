import z from 'zod';

export const signupSchema = z.object({
    firstName: z.string().min(1, "First name is required").max(50),
    lastName: z.string().min(1, "Last name is required").max(50),
    email: z.string(),
    password: z.string().min(8, "Password must be at least 8 characters"),
    role: z.enum(["ADMIN" , "STAFF"]).default("STAFF")
});

export type SignupData = z.infer<typeof signupSchema>;