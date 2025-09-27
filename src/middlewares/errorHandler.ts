import type { NextFunction, Request, Response } from "express"
import { AppError } from "../utils/errors/customErrors.ts"
import { sendError } from "../utils/general/response.ts";

// Helper to Handle Database Error
const handleDatabaseError = (err: any): AppError => {
    if(err.code === 'P2002'){
        return new AppError("Duplicate Entry Found" , 409);
    }
    if(err.code === 'P2025'){
        return new AppError("Record Not Found" , 404);
    }
    if(err.code === 'P2003'){
        return new AppError("Foreign Key Constraint Failed" , 400);
    }

    return new AppError("Database Error Occurred" , 500);
};

// Helper to Handle JWT Error
const handleJWTError = (err: any): AppError => {
    return new AppError("Invalid Token. Please Login Again" , 401);
};

// Helper to Handle JWT Expired Error
const handleJWTExpiredError = (err: any): AppError => {
    return new AppError("Token Expired. Please Login Again" , 401);
};

// Helper to Handle Zod Error
const handleZodError = (err: any): AppError => {
    const message = err.errors.map((error: any) => error.message).join('. ');
    return new AppError(`Validation Error : ${message}` , 400);
};

// Helper to Send Development Error Response
const sendErrorDev = (err: AppError , res: Response) => {
    sendError(res , err.message , err.statusCode , {
        error: err,
        stack: err.stack
    });
};

// Helper to Send Production Error Response
const sendErrorProd = (err: AppError , res: Response) => {
    if(err.isOperational){
        sendError(res , err.message , err.statusCode);
    }
    else{
        console.error('ERROR 💥', err);
        sendError(res , "Something Went Wrong!" , 500);
    }
};

// Global Error Middleware
export const globalErrorHandler = (
    err: any,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    if(process.env.NODE_ENV === 'development'){
        sendErrorDev(err , res);
    }
    else{
        let error = {
            ...err
        };
        error.message = err.message;

        if(error.code?.startsWith('P')){
            error = handleDatabaseError(error);
        }
        if(error.name === 'JsonWebTokenError'){
            error = handleJWTError(error);
        }
        if(error.name === 'TokenExpiredError'){
            error = handleJWTExpiredError(error);
        }
        if(error.name === 'ZodError'){
            error = handleZodError(error);
        }

        sendErrorProd(error , res);
    };
}