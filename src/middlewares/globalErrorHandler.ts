import type { NextFunction, Request, Response } from "express"

interface CustomError extends Error{
    statusCode? : number
}

export const globalErrorHandler = ( err: CustomError , req: Request , res: Response , next: NextFunction ) => {
    console.error("Error: ", err.message);

    const statusCode = err.statusCode || 500;
    const message = err.message || "Something went wrong...";

    res.status(statusCode).json({
        success: false,
        message,
    });
}