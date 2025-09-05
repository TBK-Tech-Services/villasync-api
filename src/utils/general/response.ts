import type { Response } from "express";
import type { ResponseData } from "../../types/general/responseData.ts";

export function sendSuccess<T>(res: Response , data: T , message = "Success" , statusCode = 200) {
    const response : ResponseData<T> = {
        success: true,
        message,
        data
    };

    return res.status(statusCode).json(response);
}

export function sendError<T = null>( res: Response, message: string = "Something went wrong", statusCode = 500, data?: T) {
    const response: ResponseData<T> = {
        success: false,
        message,
        data: data ?? null,
    };
  
    return res.status(statusCode).json(response);
}