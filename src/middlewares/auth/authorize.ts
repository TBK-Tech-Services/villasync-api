import type { NextFunction, Request, Response } from "express";
import { sendError } from "../../utils/general/response.ts";
import { getPermissionsByRole } from "../../services/auth.services.ts";
import type { JWT_Payload } from "../../types/auth/payload.ts";

// Middleware to Check If a User is Authorized to Perform a Certain Task
export function authorize(requiredPermission: string) {
    return async (req: Request , res: Response , next: NextFunction): Promise<Response | void> => {
        try {
            const user = req.user as JWT_Payload | undefined;

            if (!user) {
                return sendError(res, "Unauthorized", 401, null);
            }

            const { role } = user;

            const permissions = await getPermissionsByRole(role);

            if(permissions?.includes(requiredPermission)){
                next(); 
            }
            else{
                return sendError(res , "Forbidden: Insufficient permissions" , 403 , null);
            }
        }
        catch (error) {
            console.error("Unexpected error in authorization middleware:", error);
            return sendError(res, "Internal server error", 500, null);
        }
    }
}