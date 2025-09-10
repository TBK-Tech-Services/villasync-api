import type { User } from "@prisma/client";
import prisma from "../db/DB.ts";

export async function getAllUsersService(): Promise<User[]> {
    try {
      const users = await prisma.user.findMany();
      return users;
    } 
    catch (error) {
      const message = error instanceof Error ? (error.message) : String(error);
      console.error(`Error while getting all Users : ${message}`);
      throw new Error(`Error while getting all Users : ${message}`);
    }
}
  
export async function updateUserRoleService(): Promise<void> {
    try {
      
    } 
    catch (error) {
      console.error(error);
    }
}
  
export async function inviteNewUserService(): Promise<void> {
    try {
      
    } 
    catch (error) {
      console.error(error);
    }
}