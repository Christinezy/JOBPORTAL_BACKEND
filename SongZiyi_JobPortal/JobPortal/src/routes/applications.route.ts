import authenticationMiddleware from "../middleware/authentication.middleware";
import { applyForJob, userGetApplications } from "../service/application.service";
import AppError from "../utils/app.error";
import { HttpStatus, MongoErrorStatus } from "../utils/http.status";
import express, { Request, Response, NextFunction } from "express";
import roleMiddleware from "../middleware/role.middleware";
import { CustomRequest } from "../utils/express.request";
import { isValidObjectId } from "../utils/id.validator";


const userMiddleware = roleMiddleware("user");
export const applicationsRouter = express.Router();

applicationsRouter.use(express.json());


/**
 * @openapi
 * '/applications/create-application':
 *   post:
 *     tags:
 *       - Job Application
 *     summary: Apply for a new job
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
*              $ref: '#/components/schemas/CreateApplicationRequest'
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CreateApplicationRequest'
 *       400:
 *         description: Bad Request
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error400Response'
 *       403:
 *         description: Forbidden
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error403Response'
 *       409:
 *         description: CONFLICT
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error409Response'
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error500Response'
 */
applicationsRouter.post("/create-application", authenticationMiddleware, userMiddleware, async (req: Request, res: Response) => {
  try {
    // const customReq = req as CustomRequest;
    const jobIdFromReq = String(req.body.jobId);
    const userIdFromReq = String(req.body.userId);

    const applyForNewJob = await applyForJob(jobIdFromReq, userIdFromReq);
    if (applyForNewJob) {
      res.status(HttpStatus.OK).json({ status: "success", message: "application send", job: applyForNewJob });
    } 
    else { 
      throw new AppError("invalid job id or user id", HttpStatus.BAD_REQUEST);
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
          error_message: "Missing Parameters or Invalid Parameter"
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
 * '/applications/user-applications':
 *   get:
 *     tags:
 *       - Job Application
 *     summary: Get applications for a user
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *                 description: ID of the user
 *                 default: 655146d02513574db004c7d0
 * 
 *             required:
 *               - userId
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/GetUserApplicationsResponse'
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
 *       403:
 *         description: FORBIDDEN
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error500Response'
 */


  // user get all the jobs he/she had applied for
  applicationsRouter.get("/user-applications", authenticationMiddleware, userMiddleware, async (req: Request, res: Response) => {
  try {
    const customReq = req as CustomRequest;
    const userIdFromReq = String(customReq.body.userId);

    const userApplications = await userGetApplications(userIdFromReq);

    if (userApplications.length > 0){
      res.status(HttpStatus.OK).json({userApplications, message: "get user's applications"});
    }
    else {
      res.status(HttpStatus.OK).json({ userApplications: null, message: "this user hasn't applied for any jobs"} );
    }

  } catch (error: any) {
    console.error(error);
    if (error instanceof AppError) {
      res.status(error.statusCode).json({ error_code: error.statusCode, error_message: error.errorMessage });
    } else {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error_code: HttpStatus.INTERNAL_SERVER_ERROR, error_message: "Internal Server Error" });
    }
  }
});
