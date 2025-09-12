import type { NextFunction, Request, Response } from "express";
import { assignPermissionsToRoleService, checkIfSameRoleNameExistService, checkRoleExistanceService, createNewRoleService, createNewUserService, getAllPermissionsService, getAllRolesService } from "../services/settings.services.ts";
import { sendError, sendSuccess } from "../utils/general/response.ts";
import { getUserService } from "../services/auth.services.ts";
import { hashPassword } from "../utils/auth/hashPassword.ts";
import prisma from "../db/DB.ts";

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

// Controller to get General Settings
export async function getGeneralSettings(req: Request, res: Response, next: NextFunction): Promise<void> {
    try { 
        
    } 
    catch (error) { 
        next(error);
    }
}

// Controller to Update General Settings 
export async function updateGeneralSettings(req: Request, res: Response, next: NextFunction): Promise<void> {
    try { 
        
    } 
    catch (error) { 
        next(error);
    }
}

// Controller to get All Villas Settings
export async function getAllVillasSettings(req: Request, res: Response, next: NextFunction): Promise<void> {
    try { 
        
    } 
    catch (error) { 
        next(error);
    }
}

// Controller to Update a Villa Settings
export async function updateVillaSettings(req: Request, res: Response, next: NextFunction): Promise<void> {
    try { 
        
    } 
    catch (error) { 
        next(error);
    }
}

// Controller to get All Users
export async function getAllUsers(req: Request, res: Response, next: NextFunction): Promise<void> {
    try { 
        
    } 
    catch (error) { 
        next(error);
    }
}

// Controller to Update Backup Settings
export async function updateBackupSettings(req: Request, res: Response, next: NextFunction): Promise<void> {
    try { 
        
    } 
    catch (error) { 
        next(error);
    }
}

// Controller to Export All Data
export async function exportAllData(req: Request, res: Response, next: NextFunction): Promise<void> {
    try { 
        
    } 
    catch (error) { 
        next(error);
    }
}