import { HttpStatus, MongoErrorStatus } from "../utils/http.status";
import { Response, Request, NextFunction } from "express";
import { CustomRequest } from "../utils/express.request";


const roleMiddleware = (role: string) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const customReq = req as CustomRequest;

    // Check if the role matches the required role
    // console.log("current role", customReq.role, role)
    if (customReq.role !== role) {
      return res.status(HttpStatus.FORBIDDEN).json({ error_code:HttpStatus.FORBIDDEN, error_message: "No permission to access"} );
    }

    // Role matches, proceed to the next middleware or route handler
    next();
  };
};


export default roleMiddleware;