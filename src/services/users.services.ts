import type { User } from "@prisma/client";
import prisma from "../db/DB.ts";

// Service to get All Users
export async function getAllUsersService(): Promise<User[]> {
    try {
      const users = await prisma.user.findMany({
        include : {
          role : {
            select : {
              name : true
            }
          }
        }
      });
      return users;
    } 
    catch (error) {
      const message = error instanceof Error ? (error.message) : String(error);
      console.error(`Error while getting all Users : ${message}`);
      throw new Error(`Error while getting all Users : ${message}`);
    }
}
  
// Service to Update a User Role
export async function updateUserRoleService(): Promise<void> {
    try {
      
    } 
    catch (error) {
      console.error(error);
    }
}
  
// Service to Invite New User
export async function inviteNewUserService(): Promise<void> {
    try {
      
    } 
    catch (error) {
      console.error(error);
    }
}