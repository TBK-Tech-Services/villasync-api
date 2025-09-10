import z, { string } from 'zod';

export const inviteUserSchema = z.object({
    firstName: z.string().min(1, "First name is required").max(50),
    lastName: z.string().min(1, "Last name is required").max(50),
    email: z.string(),
    password: z.string().min(8, "Password must be at least 8 characters"),
    role : z.union([
        z.string().min(1, "Role name is required"),
        z.number().int().positive(),
    ]),
    permissions : z.array(
        z.number().int().positive()
    ).optional(),
}).refine((data) => {
    if (typeof data.role === 'string' && (!data.permissions || data.permissions.length === 0)) {
        return false;
    }
    return true;
}, {
    message: "Permissions are required when creating a new role",
    path: ["permissions"]
});

export type inviteUserData = z.infer<typeof inviteUserSchema>;