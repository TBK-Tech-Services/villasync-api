import type { GeneralSetting, Permission, PrismaClient, Role, User } from "@prisma/client";
import prisma from "../db/DB.ts";
import type { createUserData } from "../validators/data-validators/settings/createUser.ts";
import type { AssignRolePermissionsInput } from "../validators/data-validators/settings/assignRolePermissionsInput.ts";
import type { addGeneralSettingsData } from "../validators/data-validators/settings/addGeneralSettings.ts";

// Service to get All Roles
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

// Service to get All Permissions
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

// Service to Check an Existance of a Role
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

// Service to Create a New Role
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

// Service to Check If The Same Role Name Exist
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

// Service to Create a New User
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

// Service to Assign Permissions to a Role
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

// Service to Update an Existance User
export async function updateUserService(): Promise<void> {
    try {

    } 
    catch (error) { 
        console.error(error); 
    }
}

// Service to Add general Settings
export async function addGeneralSettingsService(validatedData: addGeneralSettingsData): Promise<GeneralSetting | null>{
    try {
        const generalSetting = await prisma.generalSetting.create({
            data : validatedData
        });

        return generalSetting;
    } 
    catch (error) { 
        const message = error instanceof Error ? (error.message) : String(error);
        console.error(`Error while adding general setting : ${message}`);
        throw new Error(`Error while adding general setting : ${message}`);
    }
}

// Service to check if General Setting Exist
export async function checkIfGeneralSettingExistService(generalSettingId: number): Promise<GeneralSetting | null> {
    try {   
        const generalSetting = await prisma.generalSetting.findUnique({
            where : {
                id : generalSettingId
            }
        });

        return generalSetting;
    }
    catch (error) { 
        const message = error instanceof Error ? (error.message) : String(error);
        console.error(`Error while checking if general setting exist : ${message}`);
        throw new Error(`Error while checking if general setting exist : ${message}`);
    }
}

// Service to Update general Settings
export async function updateGeneralSettingsService(generalSettingId: number , validatedData: any): Promise<GeneralSetting | null>{
    try {   
        const updatedGeneralSetting = await prisma.generalSetting.update({
            where : {
                id : generalSettingId
            },
            data : validatedData
        });

        return updatedGeneralSetting;
    } 
    catch (error) { 
        const message = error instanceof Error ? (error.message) : String(error);
        console.error(`Error while updating general setting : ${message}`);
        throw new Error(`Error while updating general setting : ${message}`);
    }
}

// Service to get General Settings
export async function getGeneralSettingsService(generalSettingId: number): Promise<GeneralSetting | null> {
    try {
        const generalSettings = await prisma.generalSetting.findUnique({
            where : {
                id : generalSettingId
            },
        });

        return generalSettings;
    } 
    catch (error) { 
        const message = error instanceof Error ? (error.message) : String(error);
        console.error(`Error while getting general setting : ${message}`);
        throw new Error(`Error while getting general setting : ${message}`);
    }
}

// Service to get All Villas Settings
export async function getAllVillasSettingsService(): Promise<void> {
    try {

    } 
    catch (error) { 
        console.error(error); 
    }
}

// Service to Update a Villa Settings
export async function updateVillaSettingsService(): Promise<void> {
    try {

    } 
    catch (error) { 
        console.error(error); 
    }
}

// Service to get All Users
export async function getAllUsersService(): Promise<void> {
    try {

    } 
    catch (error) { 
        console.error(error); 
    }
}

// Service to Update Backup Settings
export async function updateBackupSettingsService(): Promise<void> {
    try {

    } 
    catch (error) { 
        console.error(error); 
    }
}

// Service to Export All Data
export async function exportAllDataService(): Promise<void> {
    try {

    } 
    catch (error) { 
        console.error(error); 
    }
}