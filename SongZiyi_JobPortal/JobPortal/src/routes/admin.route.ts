import {userRegister,userLogin, getProfile, getAllUsers} from "../service/user.service";
import express, { Request, Response, NextFunction } from "express";
import { HttpStatus, MongoErrorStatus } from "../utils/http.status";
import AppError from "../utils/app.error";
import User from "../models/user";


export const adminRouter = express.Router();

adminRouter.use(express.json());

  /**
   * @openapi
   * '/admin/register':
   *  post:
   *     tags:
   *     - Admin
   *     summary: Register a admin user
   *     requestBody:
   *      required: true
   *      content:
   *        application/json:
   *           schema:
   *              $ref: '#/components/schemas/AdminUserRegisterInput'
   *     responses:
   *      200:
   *        description: Success
   *        content:
   *          application/json:
   *            schema:
   *              $ref: '#/components/schemas/UserRegisterResponse'
   *      400:
   *         description: BAD_REQUEST
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error400Response'
   *      409:
   *         description: CONFLICT
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error409Response'
   *      500:
   *         description: INTERNAL_SERVER_ERROR
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error500Response'
   */

adminRouter.post("/register", async (req: Request, res: Response) => {
  try {
      const newAdmin = req?.body as User;
      const result = await userRegister(newAdmin, "admin")
      if (result.status === "success") {
        res.status(HttpStatus.OK).json({ status: result.status });
      }

    } catch (error) {
      console.error(error);

      if (error instanceof AppError) {
        res.status(error.statusCode).json({
          error_code: error.statusCode,
          error_message: error.errorMessage
        });
      } else {
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
          error_code: HttpStatus.INTERNAL_SERVER_ERROR,
          error_message: "Internal Server Error"
        });
      }
  }
});


/**
 * @openapi
 * '/admin/login':
 *  post:
 *     tags:
 *     - Admin
 *     summary: Login a admin user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *               $ref: '#/components/schemas/AdminUserLoginInput' 
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AdminUserLoginResponse'
 *
 *       400:
 *         description: BAD_REQUEST
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error400Response'
 *       500:
 *         description: INTERNAL_SERVER_ERROR
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error500Response'
 */

adminRouter.post("/login", async (req: Request, res: Response) => {
  try {
      const { email, password }: { email: string; password: string } = req.body;

      // get token when login
      const token = await userLogin(email, password);
      res.status(HttpStatus.OK).json({ status: "success", token: token });

    } catch (error: any) {
      console.error(error);
  
      if (error instanceof AppError) {
        res.status(error.statusCode).json({
          error_code: error.statusCode,
          error_message: error.errorMessage
        });
      } else {
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
          error_code: HttpStatus.INTERNAL_SERVER_ERROR,
          error_message: "Internal Server Error"
        });
      }
    }
  });
