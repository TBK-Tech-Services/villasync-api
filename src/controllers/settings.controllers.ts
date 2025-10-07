import type { NextFunction, Request, Response } from "express";
import { addGeneralSettingsService, assignPermissionsToRoleService, assignVillasToOwnerService, checkIfGeneralSettingExistService, checkIfOwnerExistsService, checkIfSameRoleNameExistService, checkRoleExistanceService, createNewRoleService, createNewUserService, getAllOwnersService, getAllOwnersWithVillasService, getAllPermissionsService, getAllRolesService, getGeneralSettingsService, unassignAllVillasFromOwnerService, unassignSpecificVillaService, updateGeneralSettingsService, updateOwnerVillaAssignmentsService } from "../services/settings.services.ts";
import { sendSuccess } from "../utils/general/response.ts";
import { getUserService } from "../services/auth.services.ts";
import { hashPassword } from "../utils/auth/hashPassword.ts";
import prisma from "../db/DB.ts";
import { addGeneralSettingsSchema } from "../validators/data-validators/settings/addGeneralSettings.ts";
import { updateGeneralSettingParamSchema } from "../validators/data-validators/settings/updateGeneralSettingsParam.ts";
import { updateGeneralSettingBodySchema } from "../validators/data-validators/settings/updateGeneralSettingsBody.ts";
import catchAsync from "../utils/general/catchAsync.ts";
import { ValidationError, NotFoundError, ConflictError, InternalServerError } from "../utils/errors/customErrors.ts";
import { assignVillasToOwnerSchema } from "../validators/data-validators/settings/assignVillasToOwner.ts";
import { updateVillaAssignmentParamSchema } from "../validators/data-validators/settings/updateVillasAssignmentParam.ts";
import { updateVillaAssignmentBodySchema } from "../validators/data-validators/settings/updateVillasAssignmentBody.ts";
import { unassignSpecificVillaParamSchema } from "../validators/data-validators/settings/unassignSpecificVillaParam.ts";
import { unassignAllVillasParamSchema } from "../validators/data-validators/settings/unassignAllVillasParam.ts";

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
export const assignVillasToOwner = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const validationResult = assignVillasToOwnerSchema.safeParse(req.body);
    
    if (!validationResult.success) {
        throw validationResult.error;
    }
    
    const validatedData = validationResult.data;

    const owner = await checkIfOwnerExistsService({ownerId : validatedData.ownerId});
    if(owner === null){
        throw new NotFoundError("Selected Owner does not exist");
    }

    const villaAssignment = await assignVillasToOwnerService({ownerId : validatedData.ownerId , villas: validatedData.villaIds});
    if(villaAssignment === null){
        throw new InternalServerError("Failed to assign villas to owner");
    }

    return sendSuccess(res , villaAssignment , "Successfully Assigned Villas to Owner" , 200);
});

// Controller to Update a Villa Assignment to Owner
export const updateOwnerVillaAssignments = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const paramsValidation = updateVillaAssignmentParamSchema.safeParse(req.params);
    
    if (!paramsValidation.success) {
        throw new ValidationError("Invalid villa ID format");
    }
    
    const ownerId = paramsValidation.data.ownerId;
    
    const bodyValidation = updateVillaAssignmentBodySchema.safeParse(req.body);
    
    if (!bodyValidation.success) {
        throw bodyValidation.error;
    }
    
    const validatedData = bodyValidation.data;

    const owner = await checkIfOwnerExistsService({ownerId : ownerId});
    if(owner === null){
        throw new NotFoundError("Selected Owner does not exist");
    }

    const updatedVillaAssignment = await updateOwnerVillaAssignmentsService({ownerId: ownerId , villas: validatedData.villaIds});
    if(updatedVillaAssignment === null){
        throw new InternalServerError("Failed to update villa assignment to owner");
    }

    return sendSuccess(res , updatedVillaAssignment , "Successfully Updated Villa Assignment to Owner" , 200);
});

// Controller to Un-Assign Specific Villa
export const unassignSpecificVilla = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const paramsValidation = unassignSpecificVillaParamSchema.safeParse(req.params);
    
    if (!paramsValidation.success) {
        throw new ValidationError("Invalid ID's format");
    }
    
    const villaId = paramsValidation.data.villaId;
    const ownerId = paramsValidation.data.ownerId;

    const unassignedSpecificVilla = await unassignSpecificVillaService({villaId: villaId , ownerId: ownerId});
    return sendSuccess(res , unassignedSpecificVilla , "Successfully Un-Assigned Specifc Villa to Owner" , 200);
});

// Controller to Un-Assign All Villas From Owner
export const unassignAllVillasFromOwner = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const paramsValidation = unassignAllVillasParamSchema.safeParse(req.params);
    
    if (!paramsValidation.success) {
        throw new ValidationError("Invalid Owner ID format");
    }
    
    const ownerId = paramsValidation.data.ownerId;

    const unassignedVillas = await unassignAllVillasFromOwnerService({ownerId: ownerId});
    return sendSuccess(res , unassignedVillas , "Successfully Un-Assigned All Villas to Owner" , 200);
});

// Controller to get All Owners
export const getAllOwners = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const owners = await getAllOwnersService();
    if (owners.length === 0) {
        throw new NotFoundError("No owners found");
    }

    return sendSuccess(res , owners , "Successfully Get all Owners" , 200);
});

// Controller to get All Owners with Villas
export const getAllOwnersWithVillas = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const owners = await getAllOwnersWithVillasService();
    if (owners.length === 0) {
        throw new NotFoundError("No owners found");
    }

    return sendSuccess(res , owners , "Successfully Get all Owners with Villas" , 200);
});

// Controller to get All Stats
export const getVillaOwnerManagementStats = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    
});