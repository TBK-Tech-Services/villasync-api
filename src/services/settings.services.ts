import type { GeneralSetting, Permission, PrismaClient, Role, User, Villa } from "@prisma/client";
import prisma from "../db/DB.ts";
import type { createUserData } from "../validators/data-validators/settings/createUser.ts";
import type { AssignRolePermissionsInput } from "../validators/data-validators/settings/assignRolePermissionsInput.ts";
import type { addGeneralSettingsData } from "../validators/data-validators/settings/addGeneralSettings.ts";
import { InternalServerError, NotFoundError, ConflictError } from "../utils/errors/customErrors.ts";

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
export async function createNewUserService({ firstName, lastName, email, password, roleId }: createUserData, client: PrismaClient | any = prisma): Promise<User | null> {
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
export async function assignPermissionsToRoleService({ roleId, permissionIds }: AssignRolePermissionsInput, client: PrismaClient | any = prisma): Promise<void> {
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

// Service to check if Owner Exist
export async function checkIfOwnerExistsService({ ownerId }: { ownerId: number }): Promise<User | null> {
    try {
        const owner = await prisma.user.findUnique({
            where: {
                id: ownerId,
            }
        });

        return owner;
    }
    catch (error) {
        console.error(`Error checking if owner exist: ${error}`);
        throw new InternalServerError("Failed to check if owner exist");
    }
}

// Service to Assign Villas to Owner
export async function assignVillasToOwnerService({ ownerId, villas }: { ownerId: number, villas: number[] }): Promise<{ count: number }> {
    try {
        const alreadyOwned = await prisma.villa.findMany({
            where: {
                id: { in: villas },
                ownerId: { not: null, notIn: [ownerId] }
            },
            select: { id: true, name: true }
        });

        if (alreadyOwned.length > 0) {
            const names = alreadyOwned.map(v => v.name).join(", ");
            throw new ConflictError(`The following villas are already assigned to another owner: ${names}`);
        }

        const villaOwners = await prisma.villa.updateMany({
            where: {
                id: { in: villas }
            },
            data: {
                ownerId: ownerId
            }
        });

        return villaOwners;
    }
    catch (error) {
        if (error instanceof ConflictError) throw error;
        console.error(`Error assigning villas to owner: ${error}`);
        throw new InternalServerError("Failed to assign villas to owner");
    }
}

// Service to Update a Villa Assignment to Owner
export async function updateOwnerVillaAssignmentsService({ ownerId, villas }: { ownerId: number, villas: number[] }): Promise<{ count: number }> {
    try {
        const alreadyOwned = await prisma.villa.findMany({
            where: {
                id: { in: villas },
                ownerId: { not: null, notIn: [ownerId] }
            },
            select: { id: true, name: true }
        });

        if (alreadyOwned.length > 0) {
            const names = alreadyOwned.map(v => v.name).join(", ");
            throw new ConflictError(`The following villas are already assigned to another owner: ${names}`);
        }

        const result = await prisma.$transaction(async (tx) => {
            await tx.villa.updateMany({
                where: { ownerId: ownerId },
                data: { ownerId: null }
            });

            const updatedVillas = await tx.villa.updateMany({
                where: { id: { in: villas } },
                data: { ownerId: ownerId }
            });

            return updatedVillas;
        });

        return result;
    }
    catch (error) {
        if (error instanceof ConflictError) throw error;
        console.error(`Error updating villa assignment to owner: ${error}`);
        throw new InternalServerError("Failed to update villa assignment to owner");
    }
}

// Service to Un-Assign Specific Villa
export async function unassignSpecificVillaService({ villaId, ownerId }: { villaId: number, ownerId: number }): Promise<Villa> {
    try {
        const unassignedVilla = await prisma.villa.update({
            where: {
                id: villaId,
            },
            data: {
                ownerId: null
            }
        });

        return unassignedVilla;
    }
    catch (error) {
        console.error(`Error unassigning villa: ${error}`);
        throw new InternalServerError("Failed to unassign villa");
    }
}

// Service to Un-Assign All Villas From Owner
export async function unassignAllVillasFromOwnerService({ ownerId }: { ownerId: number }): Promise<User[]> {
    try {
        const unassignedVillas = await prisma.villa.updateMany({
            where: {
                ownerId: ownerId
            },
            data: {
                ownerId: null
            }
        });

        return unassignedVillas;
    }
    catch (error) {
        console.error(`Error unassigning all villas from owner: ${error}`);
        throw new InternalServerError("Failed to unassign all villas from owner");
    }
}

// Service to Get All Un-Assigned Villas
export async function getAllUnAssignedVillasService(): Promise<Villa[] | null> {
    try {
        const unassignedVillas = await prisma.villa.findMany({
            where: {
                ownerId: null
            }
        })

        return unassignedVillas;
    }
    catch (error) {
        console.error(`Error getting un-assigned villas: ${error}`);
        throw new InternalServerError("Error getting un-assigned villas");
    }
}

// Service to get All Owners
export async function getAllOwnersService(): Promise<User[]> {
    try {
        const owners = await prisma.user.findMany({
            where: {
                role: {
                    name: 'Owner'
                }
            },
        });

        return owners;
    }
    catch (error) {
        console.error(`Error getting all owners: ${error}`);
        throw new InternalServerError("Failed to get all owners");
    }
}

// Service to get All Owners with Villas
export async function getAllOwnersWithVillasService(): Promise<User[]> {
    try {
        const owners = await prisma.user.findMany({
            where: {
                role: {
                    name: 'Owner'
                }
            },
            include: {
                role: true,
                ownedVillas: true
            }
        });

        return owners;
    }
    catch (error) {
        console.error(`Error getting all owners with villas: ${error}`);
        throw new InternalServerError("Failed to get all owners with villas");
    }
}

// Service to get All Stats
export async function getVillaOwnerManagementStatsService(): Promise<{ totalOwners: number, totalAssignedVillas: number, totalUnassignedVillas: number }> {
    try {
        const result = await prisma.$transaction(async (tx) => {
            const totalOwners = await tx.user.count({
                where: {
                    role: {
                        name: 'Owner'
                    }
                }
            });

            const totalAssignedVillas = await tx.villa.count({
                where: {
                    ownerId: {
                        not: null
                    }
                }
            });

            const totalUnassignedVillas = await tx.villa.count({
                where: {
                    ownerId: null
                }
            });

            return {
                totalOwners,
                totalAssignedVillas,
                totalUnassignedVillas
            };
        });

        return result;
    }
    catch (error) {
        console.error(`Error getting villa owner management stats: ${error}`);
        throw new InternalServerError("Failed to get villa owner management stats");
    }
}

// Service to get Admin Contacts
export async function getAdminContactsService() {
    try {
        const settings = await prisma.generalSetting.findFirst();

        if (!settings) {
            throw new NotFoundError("General settings not found");
        };

        return {
            admin1: {
                name: settings.admin1Name || "Admin 1",
                email: settings.admin1Email,
                phone: settings.admin1Phone
            },
            admin2: {
                name: settings.admin2Name || "Admin 2",
                email: settings.admin2Email,
                phone: settings.admin2Phone
            }
        };
    }
    catch (error) {
        console.error(`Error getting admin contacts: ${error}`);
        throw new InternalServerError("Failed to get admin contacts");
    }
};

// Service to Update Owner Management Fee
export async function updateOwnerManagementFeeService({ ownerId, managementFeePercent }: { ownerId: number, managementFeePercent: number }): Promise<User> {
    try {
        const updatedUser = await prisma.user.update({
            where: { id: ownerId },
            data: { managementFeePercent }
        });
        return updatedUser;
    }
    catch (error) {
        console.error(`Error updating owner management fee: ${error}`);
        throw new InternalServerError("Failed to update owner management fee");
    }
}

// Service to Delete a User
export async function deleteUserService({ userId } : { userId: number }): Promise<void> {
    try {
        const user = await prisma.user.findUnique({
            where : { id : userId }
        });

        if (!user) {
            throw new NotFoundError("User not found");
        }

        await prisma.user.delete({
            where : { id : userId }
        });
    }
    catch (error) {
        if (error instanceof NotFoundError) {
            throw error;
        }
        console.error(`Error deleting user: ${error}`);
        throw new InternalServerError("Failed to delete user");
    }
}
