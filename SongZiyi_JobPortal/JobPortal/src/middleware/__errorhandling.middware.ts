import { Request, Response, NextFunction } from "express";
import AppError from "../utils/app.error";

const errorHandlingMiddleware=(err:AppError, req:Request, res:Response, next: NextFunction)=>{
    err.statusCode = err.statusCode || 500;
    // err.status = err.status || 'error';
    console.log("error caught in errorHandlingMiddleware", err, err.statusCode, err instanceof AppError);
    console.log("error caught in errorHandlingMiddleware", err.statusCode, err.message);

    console.log("error caught in errorHandlingMiddleware", err, err.statusCode)
    res.status(err.statusCode).json({
        error_code: err.statusCode,
        error_message: err.message
      });
  
}

export default errorHandlingMiddleware;