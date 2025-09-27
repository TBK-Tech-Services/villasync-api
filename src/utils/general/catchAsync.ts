import type { NextFunction, Request, Response } from "express"

// Higher Order Function to Catch Error Automatically
const catchAsync = (fn: Function) => {
    return (req: Request , res: Response , next: NextFunction) => {
        fn(req, res , next).catch(next);
    }
};

export default catchAsync;