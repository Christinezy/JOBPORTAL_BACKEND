import { addJob, getAllJobs, getJobData, deleteTheJob } from "../service/job.service";
import authenticationMiddleware from "../middleware/authentication.middleware";
import express, { Request, Response, NextFunction } from "express";
import { HttpStatus, MongoErrorStatus } from "../utils/http.status";
import roleMiddleware from "../middleware/role.middleware";
import { collections } from "../scripts/init.mongo";
import AppError from "../utils/app.error";
import { ObjectId } from "mongodb";
import Job from "../models/job";


const adminMiddleware = roleMiddleware("admin");
const userMiddleware = roleMiddleware("user");

export const jobsRouter = express.Router();
jobsRouter.use(express.json());

/**
 * @openapi
 * '/jobs/create-job':
 *   post:
 *     tags:
 *       - Jobs
 *     summary: Create a new job
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AddJobInput'
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AddJobResponse'
 *       400:
 *         description: Bad Request
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error400Response'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error401Response'
 *       403:
 *         description: Forbidden
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error403Response'
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error500Response'
 */

jobsRouter.post("/create-job", authenticationMiddleware, adminMiddleware, async (req: Request, res: Response) => {
  try {
      const newJob = req?.body as Job;
      const result = await addJob(newJob)
     if (result) {
        res.status(HttpStatus.OK).json({ status: "success", message: "job created successfully", job: result });
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
 * '/jobs/all-jobs':
 *   post:
 *     tags:
 *       - Jobs
 *     summary: List all the jobs
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ListJobResponse'
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error500Response'
 */

// List all jobs
jobsRouter.get("/all-jobs", authenticationMiddleware, async (req: Request, res: Response) => {
  try {
    const allJobs = await getAllJobs();
    res.status(HttpStatus.OK).json({ status: "success", allJobs });

  } catch (error: any) {
    console.error(error);
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error_code: HttpStatus.INTERNAL_SERVER_ERROR, error_message: "Internal Server Error" });
    }
  }
);


/**
 * @openapi
 * '/jobs/job-data/{id}':
 *   get:
 *     tags:
 *       - Jobs
 *     summary: Get job details
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Job ID
 *         schema:
 *           type: string
 *           default: 655151004d19194fdc620718
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/GetJobDataResponse'
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
 *       403:
 *         description: FORBIDDEN
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error403Response'
 *       500:
 *         description: INTERNAL_SERVER_ERROR
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error500Response'
 */

// Get job details
jobsRouter.get("/job-data/:id", authenticationMiddleware, userMiddleware, async (req: Request, res: Response) => {
  try {
    const jobId = req.params.id;
    const jobData = await getJobData(jobId);
    res.status(HttpStatus.OK).json(jobData);

  } catch (error: any) {
    console.error("error catched", error);
    if (error instanceof AppError) {
      res.status(error.statusCode).json({ error_code: error.statusCode, error_message: error.errorMessage });
    } else {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error_code: HttpStatus.INTERNAL_SERVER_ERROR, error_message: "Internal Server Error" });
    }
  }
});



/**
 * @openapi
 * '/jobs/delete-job/{id}':
 *   delete:
 *     tags:
 *       - Jobs
 *     summary: Delete a job by ID
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the job to delete
 *         schema:
 *           type: string
 *           default: 655151004d19194fdc620719
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DeleteJobResponse'
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

jobsRouter.delete("/delete-job/:id", authenticationMiddleware, adminMiddleware, async (req: Request, res: Response) => {
  try {
    const jobId = req.params.id;
    const result = await deleteTheJob(jobId);
    if (result.status === "success") {
      res.status(HttpStatus.OK).json({ status: "success", message: "job deleted successfully"});
    } 

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





