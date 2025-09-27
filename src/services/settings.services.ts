import type { GeneralSetting, Permission, PrismaClient, Role, User } from "@prisma/client";
import prisma from "../db/DB.ts";
import type { createUserData } from "../validators/data-validators/settings/createUser.ts";
import type { AssignRolePermissionsInput } from "../validators/data-validators/settings/assignRolePermissionsInput.ts";
import type { addGeneralSettingsData } from "../validators/data-validators/settings/addGeneralSettings.ts";
import { InternalServerError } from "../utils/errors/customErrors.ts";

// Service to get All Roles
export async function getAllRolesService(): Promise<Role[]> {
    try {
        const roles = await prisma.role.findMany();
        return roles;
    } 
    catch (error) { 
        console.error(`Error fetching all roles: ${error}`);
        throw new InternalServerError("Failed to fetch roles");
    }
}

// Service to get All Permissions
export async function getAllPermissionsService(): Promise<Permission[]> {
    try {
        const permissions = await prisma.permission.findMany();
        return permissions;
    } 
    catch (error) { 
        console.error(`Error fetching all permissions: ${error}`);
        throw new InternalServerError("Failed to fetch permissions");
    }
}

// Service to Check an Existance of a Role
export async function checkRoleExistanceService(role: number, client: PrismaClient | any = prisma): Promise<Role | null> {
    try {
        const roleData = await client.role.findUnique({
            where: {
                id: role
            }
        });

        return roleData;
    }
    catch (error) { 
        console.error(`Error checking role existence: ${error}`);
        throw new InternalServerError("Failed to verify role existence");
    }
}

// Service to Create a New Role
export async function createNewRoleService(role: string, client: PrismaClient | any = prisma): Promise<Role | null> {
    try {
        const newRole = await client.role.create({
            data: {
                name: role,
            }
        });

        return newRole;
    }
    catch (error) { 
        console.error(`Error creating new role: ${error}`);
        throw new InternalServerError("Failed to create new role");
    }
}

// Service to Check If The Same Role Name Exist
export async function checkIfSameRoleNameExistService(role: string, client: PrismaClient | any = prisma): Promise<Role | null> {
    try {
        const roleData = await client.role.findFirst({
            where: {
                name: role
            }
        });

        return roleData;
    }
    catch (error) { 
        console.error(`Error checking role name availability: ${error}`);
        throw new InternalServerError("Failed to check role name availability");
    }
}

// Service to Create a New User
export async function createNewUserService({firstName, lastName, email, password, roleId}: createUserData, client: PrismaClient | any = prisma): Promise<User | null> {
    try {
        const newUser = await client.user.create({
            data: {
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
        console.error(`Error creating user: ${error}`);
        throw new InternalServerError("Failed to create user");
    }
}

// Service to Assign Permissions to a Role
export async function assignPermissionsToRoleService({roleId, permissionIds}: AssignRolePermissionsInput, client: PrismaClient | any = prisma): Promise<void> {
    try {
        if (!permissionIds || permissionIds.length === 0) {
            throw new InternalServerError("At least one permission is required");
        }

        const rolePermissionMapping = permissionIds.map((permissionId) => {
            return {
                roleId: roleId,
                permissionId: permissionId
            }
        });

        await client.rolePermission.createMany({
            data: rolePermissionMapping,
            skipDuplicates: true
        });
    }
    catch (error) { 
        console.error(`Error assigning permissions to role: ${error}`);
        throw new InternalServerError("Failed to assign permissions to role");
    }
}

// Service to Add general Settings
export async function addGeneralSettingsService(validatedData: addGeneralSettingsData): Promise<GeneralSetting | null> {
    try {
        const generalSetting = await prisma.generalSetting.create({
            data: validatedData
        });

        return generalSetting;
    } 
    catch (error) { 
        console.error(`Error adding general setting: ${error}`);
        throw new InternalServerError("Failed to create general settings");
    }
}

// Service to check if General Setting Exist
export async function checkIfGeneralSettingExistService(generalSettingId: number): Promise<GeneralSetting | null> {
    try {   
        const generalSetting = await prisma.generalSetting.findUnique({
            where: {
                id: generalSettingId
            }
        });

        return generalSetting;
    }
    catch (error) { 
        console.error(`Error checking general setting existence: ${error}`);
        throw new InternalServerError("Failed to verify general setting existence");
    }
}

// Service to Update general Settings
export async function updateGeneralSettingsService(generalSettingId: number, validatedData: any): Promise<GeneralSetting | null> {
    try {   
        const updatedGeneralSetting = await prisma.generalSetting.update({
            where: {
                id: generalSettingId
            },
            data: validatedData
        });

        return updatedGeneralSetting;
    } 
    catch (error) { 
        console.error(`Error updating general setting: ${error}`);
        throw new InternalServerError("Failed to update general settings");
    }
}

// Service to get General Settings
export async function getGeneralSettingsService(): Promise<GeneralSetting[] | null> {
    try {
        const generalSettings = await prisma.generalSetting.findMany();

        return generalSettings;
    } 
    catch (error) { 
        console.error(`Error fetching general settings: ${error}`);
        throw new InternalServerError("Failed to fetch general settings");
    }
}

// Service to Assign Villas to Owner
export async function assignVillasToOwnerService(): Promise<void> {
    try {

    } 
    catch (error) { 
        console.error(error); 
    }
}

// Service to Update a Villa Assignment to Owner
export async function updateOwnerVillaAssignmentsService(): Promise<void> {
    try {

    } 
    catch (error) { 
        console.error(error); 
    }
}

// Service to Un-Assign Specific Villa
export async function unassignSpecificVillaService(): Promise<void> {
    try {

    } 
    catch (error) { 
        console.error(error); 
    }
}

// Service to Un-Assign All Villas From Owner
export async function unassignAllVillasFromOwnerService(): Promise<void> {
    try {

    } 
    catch (error) { 
        console.error(error); 
    }
}

// Service to get All Owners
export async function getAllOwnersService(): Promise<void> {
    try {

    } 
    catch (error) { 
        console.error(error); 
    }
}

// Service to get All Owners with Villas
export async function getAllOwnersWithVillasService(): Promise<void> {
    try {

    } 
    catch (error) { 
        console.error(error); 
    }
}

// Service to get All Stats
export async function getVillaOwnerManagementStatsService(): Promise<void> {
    try {

    } 
    catch (error) { 
        console.error(error); 
    }
}