
// Custom AppError Class
export class AppError extends Error {
    public statusCode: number;
    public isOperational: boolean;

    constructor(message: string , statusCode: number) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = true;
        Error.captureStackTrace(this , this.constructor);
    }
};

// Custom Validation Error Class
export class ValidationError extends AppError {
    constructor(message: string = "Validation Failed") {
        super(message , 400);
    }
};

// Custom Not Found Error Class
export class NotFoundError extends AppError {
    constructor(message: string = "Resource Not Found") {
        super(message , 404);
    }
};

// Custom Un-Authorized Error Class
export class UnauthorizedError extends AppError {
    constructor(message: string = "Unauthorized Access") {
        super(message , 401);
    }
};

// Custom Conflict Error Class
export class ConflictError extends AppError {
    constructor(message: string = "Resource Conflict") {
        super(message , 409);
    }
};

// Custom Internal Server Error Class
export class InternalServerError extends AppError {
    constructor(message: string = "Internal Server Error") {
        super(message , 500);
    }
};