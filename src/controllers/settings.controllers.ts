import type { NextFunction, Request, Response } from "express";
import { addGeneralSettingsService, assignPermissionsToRoleService, checkIfGeneralSettingExistService, checkIfSameRoleNameExistService, checkRoleExistanceService, createNewRoleService, createNewUserService, getAllPermissionsService, getAllRolesService, getGeneralSettingsService, updateGeneralSettingsService } from "../services/settings.services.ts";
import { sendSuccess } from "../utils/general/response.ts";
import { getUserService } from "../services/auth.services.ts";
import { hashPassword } from "../utils/auth/hashPassword.ts";
import prisma from "../db/DB.ts";
import { addGeneralSettingsSchema } from "../validators/data-validators/settings/addGeneralSettings.ts";
import { updateGeneralSettingParamSchema } from "../validators/data-validators/settings/updateGeneralSettingsParam.ts";
import { updateGeneralSettingBodySchema } from "../validators/data-validators/settings/updateGeneralSettingsBody.ts";
import catchAsync from "../utils/general/catchAsync.ts";
import { ValidationError, NotFoundError, ConflictError, InternalServerError } from "../utils/errors/customErrors.ts";

// Controller to get All Roles
export const getAllRoles = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const roles = await getAllRolesService();

    if (roles.length === 0) {
        throw new NotFoundError("No roles found");
    }

    sendSuccess(res, roles, "Roles retrieved successfully", 200);
});

// Controller to get All Permissions
export const getAllPermissions = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const permissions = await getAllPermissionsService();

    if (permissions.length === 0) {
        throw new NotFoundError("No permissions found");
    }

    sendSuccess(res, permissions, "Permissions retrieved successfully", 200);
});

// Controller to Invite a New User
export const inviteNewUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const {firstName, lastName, email, password, role, permissions} = req.body;

    if (!firstName || !lastName || !email || !password || !role || role < 0) {
        throw new ValidationError("All fields are required: firstName, lastName, email, password, role");
    }

    const result = await prisma.$transaction(async (tx) => {
        const user = await getUserService({email}, tx);

        if (user) {
            throw new ConflictError("User already exists with this email");
        }

        const hashedPassword = await hashPassword(password);

        if (!hashedPassword) {
            throw new InternalServerError("Failed to hash password");
        }

        if (typeof role === 'number') {
            const roleData = await checkRoleExistanceService(role, tx);

            if (!roleData) {
                throw new NotFoundError("Selected role does not exist");
            }

            const newUser = await createNewUserService({firstName, lastName, email, password: hashedPassword, roleId: role}, tx);

            return { newUser, message: "User created successfully" };
        }
        else if (typeof role === 'string') {
            const roleData = await checkIfSameRoleNameExistService(role, tx);

            if (roleData) {
                throw new ConflictError("Role with the same name already exists");
            }

            const newRole = await createNewRoleService(role, tx);

            if (!newRole) {
                throw new InternalServerError("Failed to create new role");
            }

            const newUser = await createNewUserService({firstName, lastName, email, password: hashedPassword, roleId: newRole?.id}, tx);

            if (!newUser) {
                throw new InternalServerError("Failed to create user");
            }

            if (!newUser.roleId) {
                throw new InternalServerError("User created but role assignment failed");
            }

            await assignPermissionsToRoleService({roleId: newUser?.roleId, permissionIds: permissions}, tx);

            return { newUser, message: "User and role created successfully" };
        }
    });

    if (!result) {
        throw new InternalServerError("Transaction failed unexpectedly");
    }

    sendSuccess(res, result.newUser, result.message, 201);
});

// Controller to Add General Settings 
export const addGeneralSettings = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const validationResult = addGeneralSettingsSchema.safeParse(req.body);

    if (!validationResult.success) {
        throw validationResult.error;
    }

    const validatedData = validationResult.data;

    const generalSetting = await addGeneralSettingsService(validatedData);

    if (generalSetting === null) {
        throw new InternalServerError("Failed to create general settings");
    }

    sendSuccess(res, generalSetting, "General settings created successfully", 201);
});

// Controller to Update General Settings 
export const updateGeneralSettings = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const paramsValidation = updateGeneralSettingParamSchema.safeParse(req.params);

    if (!paramsValidation.success) {
        throw new ValidationError("Invalid general setting ID format");
    }

    const generalSettingId = paramsValidation.data.id;

    const bodyValidation = updateGeneralSettingBodySchema.safeParse(req.body);

    if (!bodyValidation.success) {
        throw bodyValidation.error;
    }

    const validatedData = bodyValidation.data;

    const generalSettingExistance = await checkIfGeneralSettingExistService(generalSettingId);

    if (generalSettingExistance === null) {
        throw new NotFoundError("General setting with this ID does not exist");
    }

    const updatedGeneralSetting = await updateGeneralSettingsService(generalSettingId, validatedData);

    if (updatedGeneralSetting === null) {
        throw new InternalServerError("Failed to update general settings");
    }

    sendSuccess(res, updatedGeneralSetting, "General settings updated successfully", 200);
});

// Controller to get General Settings
export const getGeneralSettings = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const generalSettings = await getGeneralSettingsService();

    if (generalSettings === null || generalSettings.length === 0) {
        throw new NotFoundError("No general settings found");
    }

    sendSuccess(res, generalSettings, "General settings retrieved successfully", 200);
});

// Controller to Assign Villas to Owner
export async function assignVillasToOwner(req: Request, res: Response, next: NextFunction): Promise<void> {
    try { 
        
    } 
    catch (error) { 
        next(error);
    }
}

// Controller to Update a Villa Assignment to Owner
export async function updateOwnerVillaAssignments(req: Request, res: Response, next: NextFunction): Promise<void> {
    try { 
        
    } 
    catch (error) { 
        next(error);
    }
}

// Controller to Un-Assign Specific Villa
export async function unassignSpecificVilla(req: Request, res: Response, next: NextFunction): Promise<void> {
    try { 
        
    } 
    catch (error) { 
        next(error);
    }
}

// Controller to Un-Assign All Villas From Owner
export async function unassignAllVillasFromOwner(req: Request, res: Response, next: NextFunction): Promise<void> {
    try { 
        
    } 
    catch (error) { 
        next(error);
    }
}

// Controller to get All Owners
export async function getAllOwners(req: Request, res: Response, next: NextFunction): Promise<void> {
    try { 
        
    } 
    catch (error) { 
        next(error);
    }
}

// Controller to get All Owners with Villas
export async function getAllOwnersWithVillas(req: Request, res: Response, next: NextFunction): Promise<void> {
    try { 
        
    } 
    catch (error) { 
        next(error);
    }
}

// Controller to get All Stats
export async function getVillaOwnerManagementStats(req: Request, res: Response, next: NextFunction): Promise<void> {
    try { 
        
    } 
    catch (error) { 
        next(error);
    }
}