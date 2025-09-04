import { AppError } from "./index"

import { Request, Response } from "express";

export const errorMiddleware = (err : Error, req:Request, res:Response) => {
    if(err instanceof AppError){
        console.log(`Error: ${req.method} ${req.url} ${err.message}, Status Code: ${err.statusCode}`);
        return res.status(err.statusCode).json({
            status: 'error',
            message: err.message,
            ...(err.details && { details: err.details })
        });
    }

    console.error(`Unexpected Error: ${req.method} ${req.url} ${err.message}`);
    return res.status(500).json({
        status: 'error',
        message: 'Internal Server Error'
    });
}