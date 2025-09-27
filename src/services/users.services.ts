import type { User } from "@prisma/client";
import prisma from "../db/DB.ts";
import { InternalServerError } from "../utils/errors/customErrors.ts";

// Service to get All Users
export async function getAllUsersService(): Promise<User[]> {
    try {
        const users = await prisma.user.findMany({
            include: {
                role: {
                    select: {
                        name: true
                    }
                }
            }
        });
        
        return users;
    } 
    catch (error) {
        console.error(`Error fetching all users: ${error}`);
        throw new InternalServerError("Failed to fetch users");
    }
}