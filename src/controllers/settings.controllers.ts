import type { NextFunction, Request, Response } from "express";
import { assignPermissionsToRoleService, checkIfSameRoleNameExistService, checkRoleExistanceService, createNewRoleService, createNewUserService, getAllPermissionsService, getAllRolesService } from "../services/settings.services.ts";
import { sendError, sendSuccess } from "../utils/general/response.ts";
import { getUserService } from "../services/auth.services.ts";
import { hashPassword } from "../utils/auth/hashPassword.ts";
import prisma from "../db/DB.ts";

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

export async function inviteNewUser(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try { 
        const {firstName , lastName , email , password , role , permissions} = req.body;

        if(!firstName || !lastName || !email || !password || !role || role < 0){
            return sendError(res, "Invalid request body. Required fields are missing.", 400);
        }

        const result = await prisma.$transaction(async (tx) => {
            const user = await getUserService({email} , tx);

            if(user){
                return sendError(res, "User already exists with this email.", 409);
            };

            if(typeof role === 'number'){
                const roleData = await checkRoleExistanceService(role , tx);

                if(!roleData){
                    return sendError(res, "Selected role does not exist.", 400);
                }

                const hashedPassword = await hashPassword(password);

                if(!hashedPassword){
                    return sendError(res, "Failed to hash password.", 500);
                }

                const newUser = await createNewUserService({firstName , lastName , email , password: hashedPassword , roleId: role} , tx);

                if(!newUser){
                    return sendError(res, "Failed to create user.", 500);
                }

                return sendSuccess(res, newUser, "User created successfully.", 201);
            }
            else if(typeof role === 'string'){
                const roleData = await checkIfSameRoleNameExistService(role , tx);

                if(roleData){
                    return sendError(res, "Role with the same name already exists.", 409);
                }

                const hashedPassword = await hashPassword(password);

                if(!hashedPassword){
                    return sendError(res, "Failed to hash password.", 500);
                }

                const newRole = await createNewRoleService(role , tx);

                if(!newRole){
                    return sendError(res, "Failed to create new role.", 500);
                }

                const newUser = await createNewUserService({firstName , lastName , email , password: hashedPassword , roleId: newRole?.id} , tx);

                if (!newUser) {
                    return sendError(res, "Failed to create user.", 500);
                }

                if (!newUser.roleId) {
                    return sendError(res, "User created but roleId is missing.", 500);
                }
                            
                await assignPermissionsToRoleService({roleId: newUser?.roleId , permissionIds: permissions} , tx);

                return sendSuccess(res, newUser, "User & role created successfully.", 201);
            }
        });

        return result;
    } 
    catch (error) { 
        next(error);
    }
}

export async function updateUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    try { 
        
    } 
    catch (error) { 
        next(error);
    }
}
export async function getGeneralSettings(req: Request, res: Response, next: NextFunction): Promise<void> {
    try { 
        
    } 
    catch (error) { 
        next(error);
    }
}
export async function updateGeneralSettings(req: Request, res: Response, next: NextFunction): Promise<void> {
    try { 
        
    } 
    catch (error) { 
        next(error);
    }
}
export async function getAllVillasSettings(req: Request, res: Response, next: NextFunction): Promise<void> {
    try { 
        
    } 
    catch (error) { 
        next(error);
    }
}
export async function updateVillaSettings(req: Request, res: Response, next: NextFunction): Promise<void> {
    try { 
        
    } 
    catch (error) { 
        next(error);
    }
}
export async function getAllUsers(req: Request, res: Response, next: NextFunction): Promise<void> {
    try { 
        
    } 
    catch (error) { 
        next(error);
    }
}
export async function updateBackupSettings(req: Request, res: Response, next: NextFunction): Promise<void> {
    try { 
        
    } 
    catch (error) { 
        next(error);
    }
}
export async function exportAllData(req: Request, res: Response, next: NextFunction): Promise<void> {
    try { 
        
    } 
    catch (error) { 
        next(error);
    }
}