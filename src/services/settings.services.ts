import type { Permission, PrismaClient, Role, User } from "@prisma/client";
import prisma from "../db/DB.ts";
import type { createUserData } from "../validators/data-validators/settings/createUser.ts";
import type { AssignRolePermissionsInput } from "../validators/data-validators/settings/assignRolePermissionsInput.ts";

export async function getAllRolesService(): Promise<Role[]> {
    try {
        const roles = await prisma.role.findMany();
        return roles;
    } 
    catch (error) { 
        const message = error instanceof Error ? (error.message) : String(error);
        console.error(`Error while getting all Roles : ${message}`);
        throw new Error(`Error while getting all Roles : ${message}`);
    }
}

export async function getAllPermissionsService(): Promise<Permission[]> {
    try {
        const permissions = await prisma.permission.findMany();
        return permissions;
    } 
    catch (error) { 
        const message = error instanceof Error ? (error.message) : String(error);
        console.error(`Error while getting all Permissions : ${message}`);
        throw new Error(`Error while getting all Permissions : ${message}`);
    }
}

export async function checkRoleExistanceService(role : number , client: PrismaClient | any = prisma): Promise<Role | null> {
    try {
        const roleData = await client.role.findUnique({
            where : {
                id : role
            }
        });

        return roleData;
    }
    catch (error) { 
        const message = error instanceof Error ? (error.message) : String(error);
        console.error(`Error while checking role existance : ${message}`);
        throw new Error(`Error while checking role existance : ${message}`);
    }
}

export async function createNewRoleService(role : string , client: PrismaClient | any = prisma): Promise<Role | null> {
    try {
        const newRole = await client.role.create({
            data : {
                name : role,
            }
        });

        return newRole;
    }
    catch (error) { 
        const message = error instanceof Error ? (error.message) : String(error);
        console.error(`Error while creating a new role : ${message}`);
        throw new Error(`Error while creating a new role : ${message}`);
    }
}

export async function checkIfSameRoleNameExistService(role : string , client: PrismaClient | any = prisma): Promise<Role | null> {
    try {
        const roleData = await client.role.findFirst({
            where : {
                name : role
            }
        });

        return roleData;
    }
    catch (error) { 
        const message = error instanceof Error ? (error.message) : String(error);
        console.error(`Error while checking if role with same name exist : ${message}`);
        throw new Error(`Error while checking if role with same name exist : ${message}`);
    }
}

export async function createNewUserService({firstName , lastName , email , password , roleId}: createUserData , client: PrismaClient | any = prisma): Promise<User | null> {
    try {
        const newUser = await client.user.create({
            data : {
                firstName,
                lastName,
                email,
                password,
                roleId
            }
        });

        return newUser;
    }
    catch (error) { 
        const message = error instanceof Error ? (error.message) : String(error);
        console.error(`Error while creating a user : ${message}`);
        throw new Error(`Error while creating a user : ${message}`);
    }
}

export async function assignPermissionsToRoleService({roleId , permissionIds}: AssignRolePermissionsInput , client: PrismaClient | any = prisma): Promise<void> {
    try {
        if (!permissionIds || permissionIds.length === 0) {
            throw new Error("At least one permission is required");
        }

        const rolePermissionMapping = permissionIds.map((permissionId) => {
            return {
                roleId : roleId,
                permissionId : permissionId
            }
        });

        await client.rolePermission.createMany({
            data : rolePermissionMapping,
            skipDuplicates : true
        });
    }
    catch (error) { 
        const message = error instanceof Error ? (error.message) : String(error);
        console.error(`Error while assigning permissions to a role : ${message}`);
        throw new Error(`Error while assigning permissions to a role : ${message}`);
    }
}

export async function updateUserService(): Promise<void> {
    try {

    } 
    catch (error) { 
        console.error(error); 
    }
}
export async function getGeneralSettingsService(): Promise<void> {
    try {

    } 
    catch (error) { 
        console.error(error); 
    }
}
export async function updateGeneralSettingsService(): Promise<void>{
    try {

    } 
    catch (error) { 
        console.error(error); 
    }
}
export async function getAllVillasSettingsService(): Promise<void> {
    try {

    } 
    catch (error) { 
        console.error(error); 
    }
}
export async function updateVillaSettingsService(): Promise<void> {
    try {

    } 
    catch (error) { 
        console.error(error); 
    }
}
export async function updateNotificationSettingsService(): Promise<void> {
    try {

    } 
    catch (error) { 
        console.error(error); 
    }
}
export async function getAllUsersService(): Promise<void> {
    try {

    } 
    catch (error) { 
        console.error(error); 
    }
}
export async function updateBackupSettingsService(): Promise<void> {
    try {

    } 
    catch (error) { 
        console.error(error); 
    }
}
export async function exportAllDataService(): Promise<void> {
    try {

    } 
    catch (error) { 
        console.error(error); 
    }
}