import { encryptPassword, comparePassword, generateToken, verifyToken} from "../service/auth.service";
import { HttpStatus, MongoErrorStatus } from "../utils/http.status";
import express, { Request, Response, NextFunction } from "express";
import { CustomRequest } from "../utils/express.request";
import AppError from "../utils/app.error";


const authenticationMiddleware = (req: Request, res: Response, next: NextFunction) => {
  console.log('start authentication ....')
  const customReq = req as CustomRequest
  let token: string | null = "";

  if ( customReq.headers.authorization && customReq.headers.authorization.startsWith("Bearer")) {
    token = customReq.headers.authorization.split(" ")[1]; 
  }
  if (!token) {
    return res.status(HttpStatus.UNAUTHORIZED).json({ error_code: HttpStatus.UNAUTHORIZED, error_message: 'Unauthorized: missing authentication token' });
  }

  try {
    const { payload, role}: any = verifyToken(token);
    customReq.payload = payload;
    customReq.role = role;
    next();

  } catch (error: any) {
    if (error instanceof AppError) {
      return res.status(error.statusCode).json({ error_code: error.statusCode, error_message: error.message });
    } else {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error_code: HttpStatus.INTERNAL_SERVER_ERROR, error_message: 'Internal Server Error' });
    }
  }
};

export default authenticationMiddleware;