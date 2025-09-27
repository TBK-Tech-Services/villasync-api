import dotenv from "dotenv";
import type { NextFunction, Request, Response } from "express";
import { sendError } from "../../utils/general/response.ts";
import jwt from 'jsonwebtoken';
import type { JWT_Payload } from "../../types/auth/payload.ts";

dotenv.config();

const SECRET_KEY = process.env.SECRET_KEY;

declare global {
    namespace Express {
        interface Request {
            user?: JWT_Payload; 
        }
    }
}

// Midleware to Check If a User is Authenticated or Not
export async function authenticate(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
        if (!SECRET_KEY) {
            return sendError(res, "SECRET_KEY not configured" , 500, null);
        }

        const token = req.cookies.jwt;

        if (!token) {
            return sendError(res, "Authentication token not found" , 401, null);
        }

        try {
            const decodedJWT = jwt.verify(token, SECRET_KEY) as JWT_Payload;
            req.user = decodedJWT;
            next();
        }
        catch (jwtError) {
            return sendError(res, "Invalid or expired token" , 401, null);
        }

    } 
    catch (error) {
        console.error("Unexpected error in authentication middleware:", error);
        return sendError(res, "Internal server error", 500, null);
    }
}