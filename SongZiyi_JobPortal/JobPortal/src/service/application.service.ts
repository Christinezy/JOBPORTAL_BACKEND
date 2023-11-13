import { MongoClient, MongoClientOptions, ObjectId,  Db, Collection, WriteError, MongoError } from "mongodb";
import { HttpStatus, MongoErrorStatus } from "../utils/http.status";
import { applicationValidation } from "../dbservice/db.mgr";
import { isValidObjectId } from "../utils/id.validator";
import { collections } from "../scripts/init.mongo";
import Application from "../models/application";
import AppError from "../utils/app.error";


export async function applyForJob(jobIdFromReq: string, userIdFromReq: string) {
  let application = {} as Application;
  let newApplication;
  console.log(userIdFromReq, jobIdFromReq)
  try {
    if (!jobIdFromReq || jobIdFromReq == String(null) || jobIdFromReq == String(undefined)) {
      throw new AppError("missing jobId", HttpStatus.BAD_REQUEST);
    } 

    if (!userIdFromReq || userIdFromReq == String(null) || userIdFromReq == String(undefined)) {
      throw new AppError("missing userId", HttpStatus.BAD_REQUEST);
    } 


    const userId = isValidObjectId(userIdFromReq);
    if (!userId) {
      throw new AppError("invalid userId", HttpStatus.BAD_REQUEST);
    } 

    const jobId = isValidObjectId(jobIdFromReq);
    if (!jobId) {
      throw new AppError("invalid jobId", HttpStatus.BAD_REQUEST);
    } 

    application.jobId = jobId;
    application.userId = userId;
    application.applicationStatus = "applied";
    application.createdAt = new Date();

    
    console.log("after application validation.", application)
    const applicationExists = await collections.applications!.findOne({
      userId: application.userId,
      jobId: application.jobId,
    });

    
    if (applicationExists) {
      throw new AppError("already applied", HttpStatus.CONFLICT);
    }


    // const result = await collections.applications!.insertOne({_id: new ObjectId, jobId: jobId, userId: userId, applicationStatus: "applied", createdAt: new Date});
    const result = await collections.applications!.insertOne(application);
    const newApplication = await collections.applications!.findOne({ _id: result.insertedId });
    console.log("new job applied successfully", newApplication);
    return newApplication;

  } catch (error: any) {
    console.error(`fail to apply for a new job. application: ${JSON.stringify(newApplication)}. Error: ${JSON.stringify(error)}`);
    throw error;
  }
}


export async function userGetApplications(userIdFromReq: string) {
  if (!userIdFromReq) {
    throw new AppError("missing userId", HttpStatus.BAD_REQUEST);
  } 

  const userId = isValidObjectId(userIdFromReq);
  if (!userId) {
    throw new AppError("invalid userId", HttpStatus.BAD_REQUEST);
  } 
    const pipeline = [
      {
        $match: { userId: userId }
      },
      {
        $lookup: {
          from: "jobs",
          localField: "jobId",
          foreignField: "_id",
          as: "jobInfo"
        }
      },
      {
        $unwind: "$jobInfo"
      },
      {
        $project: {
          applicationStatus: "$applicationStatus",
          createdAt: "$createdAt",
          jobInfo: {
            jobId: "$jobId",
            title: "$jobInfo.title",
            location: "$jobInfo.location",
            company: "$jobInfo.company"
          }
        }
      }
    ];

    const applications = await collections.applications!.aggregate(pipeline).toArray();
    console.log(`get ${applications.length} job applications`)
    return applications;
}

