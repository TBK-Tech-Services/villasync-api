import type { NextFunction, Request, Response } from "express";
import { getAllPermissionsService, getAllRolesService } from "../services/settings.services.ts";
import { sendError, sendSuccess } from "../utils/general/response.ts";

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

export async function inviteNewUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    try { 
        
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