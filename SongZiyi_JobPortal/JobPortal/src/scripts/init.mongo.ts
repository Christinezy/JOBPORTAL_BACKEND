import { MongoClient, Db, Collection, ObjectId} from "mongodb";
// import { connectToCluster, } from "../dbservice/db.mgr";
import Application from "../models/application";
import User from "../models/user";
import Job from "../models/job";


const url = "mongodb://127.0.0.1:27017";
export let db: Db; 
let mongoClient: MongoClient;

async function connectToCluster() {
  try {
    const mongoClient = new MongoClient(url);
    await mongoClient.connect();
    console.log("successfully connected to MongoDB Atlas!");
    return mongoClient;

  } catch (error) {
    console.error("connection to MongoDB Atlas failed!", error);
    process.exit();
  }
}

export const collections: { 
  users?: Collection;
  admin?: Collection;
  jobs?: Collection;
  applications?: Collection;
} = {};


const initData = async () => {
  try {
    mongoClient = await connectToCluster();
    db = mongoClient.db("jobportal");

    initCollection()

    await db.collection("users").deleteMany({});
    await db.collection("jobs").deleteMany({});
    await db.collection("applications").deleteMany({});
    // console.log("Data removed successfully.");

    // Insert some initial data
    const users: User[] = [
      {
        email: "user1@example.com",
        firstName: "John",
        lastName: "Doe",
        password: "user1password",
        role: "user",
        phoneNumber: "88861888", 
        location: "Singapore",
        education: [
          { school: "National University of Singapore", degree: "Bachelor of Science in Computer Science" },
          { school: "Nanyang University", degree: "Master of Business Administration" },
        ],
        skills: ["Java", "Python", "TypeScript"]
      },
      {
        email: "user2@example.com",
        firstName: "Jane",
        lastName: "Doe",
        password: "user2password",
        phoneNumber: "88861888",
        role: "user",
        education: [
          { school: "University of Cambridge", degree: "Bachelor of Science in Finance" },
          { school: "University of Edinburgh", degree: "Master of Arts" },
        ],
        skills: ["Java", "Python", "TypeScript"]
      },
    ];


    const jobs: Job[] = [
      {
        title: "Software Engineer",
        description: "Job description...",
        active: true,
        company: "CompanyA",
        salary: "8000",
        location: "UK"

      },
      {
        title: "Data Scientist",
        description: "Job description...",
        active: true,
        company: "CompanyB"
      },
    ];

    // Insert data into collections
    const job1Id = await insertJob(jobs[0]);
    const job2Id = await insertJob(jobs[1]);

    const user1Id = await insertUser(users[0]);
    const user2Id = await insertUser(users[1]);
 
    console.log("start to application init")

    const applications: Application[] = [
      {
        jobId: job1Id || new ObjectId(), 
        userId: user1Id || new ObjectId(), 
        applicationStatus: "Pending",
        createdAt: new Date("2013-05-16")
      },
      {
        jobId: job2Id || new ObjectId(), 
        userId: user2Id || new ObjectId(), 
        applicationStatus: "Accepted",
        createdAt: new Date("2023-02-16")
      },
      {
        jobId: job1Id || new ObjectId(), 
        userId: user2Id || new ObjectId(), 
        applicationStatus: "Accepted",
        createdAt: new Date("2023-02-16")
      },
    ];
    await insertApplications(applications[0]);
    await insertApplications(applications[1]);
    await insertApplications(applications[2]);
    console.log("Data initialized and records inserted.");

  } catch (error) {
    console.error("Failed to initialize data:", error);
  }
};


async function insertJob(jobData: any) {
  try {
    const result = await db.collection("jobs").insertOne(jobData);
    if (result) {
      return result.insertedId as ObjectId;
    }
   else {
      throw new Error("Job insertion failed");
  }} catch (error) {
    console.error("Error inserting job:", error);
  }
}

async function insertUser(userData: any) {
  try {
    const result = await db.collection("users").insertOne(userData);
    if (result) {
      return result.insertedId as ObjectId;
    }
    else {
      throw new Error("Job insertion failed");
  }} catch (error) {
    console.error("Error inserting job:", error);
  }
}

async function insertApplications(applicationData: any) {
  try {
    const result = await db.collection("applications").insertOne(applicationData);
    if (result) {
      return result.insertedId as ObjectId;
    }
    else {
      throw new Error("Job insertion failed");
  }} catch (error) {
    console.error("Error inserting job:", error);
  }
}



async function initCollection() {
  let mongoClient;
  try {
    // init collections
    const usersCollection: Collection = db.collection("users");
    const adminCollection: Collection = db.collection("admin");
    const jobsCollection: Collection = db.collection("jobs");
    const applicationsCollection: Collection = db.collection("applications");

    collections.users = usersCollection;
    collections.admin = adminCollection;
    collections.jobs = jobsCollection;
    collections.applications = applicationsCollection;

  } finally {
    console.log("finalizing database connection initialization...");
  }
}

// Run the initialization
initData();
// initConnection()