import type { NextFunction, Request, Response } from "express";
import { addGeneralSettingsService, assignPermissionsToRoleService, checkIfGeneralSettingExistService, checkIfSameRoleNameExistService, checkRoleExistanceService, createNewRoleService, createNewUserService, getAllPermissionsService, getAllRolesService, getGeneralSettingsService, updateGeneralSettingsService } from "../services/settings.services.ts";
import { sendError, sendSuccess } from "../utils/general/response.ts";
import { getUserService } from "../services/auth.services.ts";
import { hashPassword } from "../utils/auth/hashPassword.ts";
import prisma from "../db/DB.ts";
import { addGeneralSettingsSchema } from "../validators/data-validators/settings/addGeneralSettings.ts";
import { updateGeneralSettingParamSchema } from "../validators/data-validators/settings/updateGeneralSettingsParam.ts";
import { updateGeneralSettingBodySchema } from "../validators/data-validators/settings/updateGeneralSettingsBody.ts";

// Controller to get All Roles
export async function getAllRoles(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try { 
        const roles = await getAllRolesService();

        if(roles.length === 0){
            return sendError(res , "No Roles Available..." , 404);
        }

        return sendSuccess(res , roles , "Successfully retrieved roles" , 200);
    }
    catch (error) { 
        next(error);
    }
}

// Controller to get All Permissions
export async function getAllPermissions(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try { 
        const permissions = await getAllPermissionsService();

        if(permissions.length === 0){
            return sendError(res , "No Permissions Available..." , 404);
        }

        return sendSuccess(res , permissions , "Successfully retrieved permissions" , 200);
    }
    catch (error) { 
        next(error);
    }
}

// Controller to Invite a New User
export async function inviteNewUser(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try { 
        const {firstName , lastName , email , password , role , permissions} = req.body;

        if(!firstName || !lastName || !email || !password || !role || role < 0){
            return sendError(res, "Invalid request body. Required fields are missing.", 400);
        }

        const result = await prisma.$transaction(async (tx) => {
            const user = await getUserService({email} , tx);

            if(user){
                throw { status: 409, message: "User already exists with this email." };
            };

            const hashedPassword = await hashPassword(password);

            if(!hashedPassword){
                throw { status: 500, message: "Failed to hash password." };
            }

            if(typeof role === 'number'){
                const roleData = await checkRoleExistanceService(role , tx);

                if(!roleData){
                    throw { status: 400, message: "Selected role does not exist." };
                }

                const newUser = await createNewUserService({firstName , lastName , email , password: hashedPassword , roleId: role} , tx);

                return { newUser, message: "User created successfully." };
            }
            else if(typeof role === 'string'){
                const roleData = await checkIfSameRoleNameExistService(role , tx);

                if(roleData){
                    throw { status: 409, message: "Role with the same name already exists." };
                }

                const newRole = await createNewRoleService(role , tx);

                if(!newRole){
                    throw { status: 500, message: "Failed to create new role." };
                }

                const newUser = await createNewUserService({firstName , lastName , email , password: hashedPassword , roleId: newRole?.id} , tx);

                if (!newUser) {                    
                    throw { status: 500, message: "Failed to create user." };
                }

                if (!newUser.roleId) {
                    throw { status: 500, message: "User created but roleId is missing." };
                }
                            
                await assignPermissionsToRoleService({roleId: newUser?.roleId , permissionIds: permissions} , tx);

                return { newUser, message: "User & role created successfully." };
            }
        });

        if (!result) {
            return sendError(res, "Unexpected error, no result from transaction.", 500);
        }
        
        return sendSuccess(res, result.newUser, result.message, 201);
    } 
    catch (error) { 
        next(error);
    }
}

// Controller to Update an Existing User
export async function updateUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    try { 
        
    } 
    catch (error) { 
        next(error);
    }
}

// Controller to Add General Settings 
export async function addGeneralSettings(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try { 
        const validationResult = addGeneralSettingsSchema.safeParse(req.body);
        
        if(!validationResult.success){
            return sendError(res , "Validation Failed !!!" , 400 , validationResult.error);
        }
        
        const validatedData = validationResult.data;

        const generalSetting = await addGeneralSettingsService(validatedData);

        if(generalSetting === null){
            return sendError(res,  "Didnt Get General Setting !" , 404 , null);
        }

        return sendSuccess(res , generalSetting , "Successfully Added General Settings!" , 201);
    } 
    catch (error) { 
        next(error);
    }
}

// Controller to Update General Settings 
export async function updateGeneralSettings(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try { 
        const paramsValidation = updateGeneralSettingParamSchema.safeParse(req.params);
        
        if (!paramsValidation.success) {
            return sendError(res, "Invalid General Setting ID", 400, paramsValidation.error);
        }
        
        const generalSettingId = paramsValidation.data.id;
        
        const bodyValidation = updateGeneralSettingBodySchema.safeParse(req.body);
        
        if (!bodyValidation.success) {
            return sendError(res, "Validation Failed", 400, bodyValidation.error);
        }
        
        const validatedData = bodyValidation.data;

        const generalSettingExistance = await checkIfGeneralSettingExistService(generalSettingId);

        if(generalSettingExistance === null){
            return sendError(res , "General Setting Doesnt Exist!" , 404 , null);
        }

        const updatedGeneralSetting = await updateGeneralSettingsService(generalSettingId , validatedData);

        if(updatedGeneralSetting === null){
            return sendError(res , "Didnt Get Updated General Setting!" , 404 , null);
        }

        return sendSuccess(res , updatedGeneralSetting , "Successfully Updated General Setting!" , 200);
    } 
    catch (error) { 
        next(error);
    }
}

// Controller to get General Settings
export async function getGeneralSettings(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try { 
        const generalSettings = await getGeneralSettingsService();

        if(generalSettings === null){
            return sendError(res , "Didnt Get General Setting !" , 404 , null);
        }

        return sendSuccess(res , generalSettings , "Successfully Get General Settings!" , 200);
    }
    catch (error) {
        next(error);
    }
}

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