import { MongoClient, MongoClientOptions, ObjectId,  Db, Collection, WriteError, MongoError } from "mongodb";
import { encryptPassword, comparePassword, generateToken, verifyToken} from "./auth.service";
import { HttpStatus, MongoErrorStatus } from "../utils/http.status";
import {jobValidation} from "../dbservice/db.mgr"
import { isValidObjectId } from "../utils/id.validator";
import { collections } from "../scripts/init.mongo";
import AppError from "../utils/app.error";
import Job from "../models/job";
import * as crypto from "crypto";



export async function addJob(job: Job) {
  job.postedAt = new Date()
  let newJob
  try {
    await jobValidation();
    const result = await collections.jobs!.insertOne(job);
    console.log("after inserted, id",result.insertedId)
  
    newJob = await collections.jobs!.findOne({ _id: result.insertedId });
    console.log(newJob, "new job creacted");
    return newJob;
    
    // if (newJob) {
    //   // newJob.postedAt = postedAt
    //   console.log("new job id",newJob._id)
    //   const res = await collections.jobs!.updateOne({ _id: newJob._id }, { $set: {  "postedAt" } });
    //   console.log(newJob, "new job creacted");
    //   return newJob;
    // }

  } catch (error: any) {
    console.error(`fail to add a new job. Job: ${JSON.stringify(newJob)}. Error: ${JSON.stringify(error)}`);
    throw error;
  }
}


export async function deleteTheJob(jobId: string) {
  if (!jobId) {
    throw new AppError("job id is required", HttpStatus.BAD_REQUEST);
  }
  // validate if the job id is valid
  const jobObjectId = isValidObjectId(jobId)
  if (!jobObjectId) {
    throw new AppError("invalid job id", HttpStatus.BAD_REQUEST);
  } 
  const job = await collections.jobs!.findOne({ _id: jobObjectId})

  if (!job)  {
    throw new AppError("this job does not exist", HttpStatus.BAD_REQUEST);
  }

  const result = await collections.jobs!.deleteOne({ _id: jobObjectId });
  
  if (result.deletedCount && result.deletedCount === 1) {
    console.log("job deleted successfully");
    return { status: "success"};

  } else {
    throw new AppError("fail to delete the job", HttpStatus.INTERNAL_SERVER_ERROR);
  }
};


export async function getAllJobs() {
  const result = (await collections.jobs!.find({}).toArray()) as Job[];
  return result;
}

export async function getJobData(jobId: string) {
  if (!jobId) {
    throw new AppError("job id is required", HttpStatus.BAD_REQUEST);
  }

  // validate if the job id is valid
  const jobObjectId = isValidObjectId(jobId)
  if (!jobObjectId) {
    throw new AppError("invalid job id", HttpStatus.BAD_REQUEST);
  } 

  const jobData = await collections.jobs!.findOne({ _id: jobObjectId });
  if (!jobData)  {
    throw new AppError("this job does not exist", HttpStatus.BAD_REQUEST);
  }

  return jobData
}
