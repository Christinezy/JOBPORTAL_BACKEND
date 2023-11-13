import {userRegister,userLogin, getProfile, getAllUsers} from "../service/user.service";
import authenticationMiddleware from "../middleware/authentication.middleware";
import { HttpStatus, MongoErrorStatus } from "../utils/http.status";
import express, { Request, Response, NextFunction } from "express";
import roleMiddleware from "../middleware/role.middleware";
import { CustomRequest } from "../utils/express.request";
import AppError from "../utils/app.error";
import User from "../models/user";

const userMiddleware = roleMiddleware("user");

export const usersRouter = express.Router();
usersRouter.use(express.json());

  /**
   * @openapi
   * '/users/register':
   *  post:
   *     tags:
   *     - User
   *     summary: Register a user
   *     requestBody:
   *      required: true
   *      content:
   *        application/json:
   *           schema:
   *              $ref: '#/components/schemas/UserRegisterInput'
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
   *      500':
   *         description: INTERNAL_SERVER_ERROR
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error500Response'
   */
usersRouter.post("/register", async (req: Request, res: Response) => {
  try {
      const newUser = req?.body as User;
      const result = await userRegister(newUser, "user")

      if (result.status === "success") {
        res.status(HttpStatus.OK).json({ status: result.status });
      } 
    } catch (error: any) {
      console.error(error);
    
      if (error instanceof AppError) {
        res.status(error.statusCode).json({
          error_code: error.statusCode,
          error_message: error.errorMessage
        });
      } else if (error.name === "MongoError" && error.code === MongoErrorStatus.VALIDATION_FAIL) {
        // Document validation failed, input data invalid
        res.status(HttpStatus.BAD_REQUEST).json({
          error_code: HttpStatus.BAD_REQUEST,
          error_message: "missing parameters or invalid parameter"
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
 * '/users/login':
 *  post:
 *     tags:
 *     - User
 *     summary: Login a user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *               $ref: '#/components/schemas/UserLoginResponse' 
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserLoginResponse'
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

usersRouter.post("/login", async (req: Request, res: Response) => {
  try {
      const { email, password }: { email: string; password: string } = req.body;

      // get user token
      const token = await userLogin(email, password);
      res.status(HttpStatus.OK).json({ status: "success", token: token });

    } catch (error: any) {
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
 * '/users/profile':
 *  post:
 *     tags:
 *     - User
 *     summary: User view his/her profile
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *               $ref: '#/components/schemas/GetProfileInput' 
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/GetProfileResponse'
 *
 *       400:
 *         description: BAD_REQUEST
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error400Response'
 *       401:
 *         description: UNAUTHORIZED
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error401Response'
 *       500:
 *         description: INTERNAL_SERVER_ERROR
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error500Response'
 */

// Get user profile details
usersRouter.get("/profile", authenticationMiddleware, userMiddleware, async (req: Request, res: Response) => {
  try {
    const customReq = req as CustomRequest;
    const id = customReq.body.userId ?? " ";

    // get user profile
    const myprofile = await getProfile(id);
    res.status(HttpStatus.OK).json(myprofile);

  } catch (error: any) {
    // console.error("error catched", error);
    if (error instanceof AppError) {
      res.status(error.statusCode).json({ error_code: error.statusCode, error_message: error.errorMessage });
    } else {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error_code: HttpStatus.INTERNAL_SERVER_ERROR, error_message: "Internal Server Error" });
    }
  }
});


