import { MongoClient, MongoClientOptions, ObjectId,  Db, Collection, WriteError, MongoError } from "mongodb";
import { encryptPassword, comparePassword, generateToken, verifyToken} from "./auth.service";
// import {registerValidation} from "../dbservice/db.mgr";
import { HttpStatus, MongoErrorStatus } from "../utils/http.status";
import { isValidObjectId } from "../utils/id.validator";
import { collections } from "../scripts/init.mongo";
import AppError from "../utils/app.error";
import User from "../models/user";



export async function userRegister(user: User, role: string) {
  try {
    // await registerValidation();
    if (!user.password) {
      throw new AppError("missing password", HttpStatus.BAD_REQUEST);
    }
    if (!user.email) {
      throw new AppError("missing email", HttpStatus.BAD_REQUEST);
    }
    
    const email = user.email.toLowerCase();
    const isExistingEmail = await collections.users!.findOne({email})

    if (isExistingEmail) {
      throw new AppError("email already exists", HttpStatus.CONFLICT);
    }
    user.role = role
    user.password = await encryptPassword(user.password ?? "");
    const result = await collections.users!.insertOne(user);
    return { status: "success"};

  } catch (error: any) {
    console.error(`fail to register. User: ${JSON.stringify(user)}. Error: ${JSON.stringify(error)}`);
    throw error;
  }
}


export async function userLogin(email: string, password: string) {
  try {
    if (
      typeof email !== "string" || 
      typeof password !== "string" || 
      !email || ! password
    ) {
      throw new AppError("invalid Email or password.", HttpStatus.BAD_REQUEST);
    }

    const user = await collections.users!.findOne({email});
    if (!user) {
      throw new AppError("this user does not exist", HttpStatus.BAD_REQUEST);
    }

    const isPasswordCorrect = await comparePassword(password, user.password ?? "");
    if (!isPasswordCorrect) {
      throw new AppError("incorrect password", HttpStatus.BAD_REQUEST);
    }
    const payload = user._id ? user._id.toString() : "";
    // use payload(id) and role to generate token
    const role = user.role;
    const token = generateToken(payload, role);
    return token;

  } catch (error: any) {
    console.error(`fail to login.  Error: ${JSON.stringify(error)}`);
    throw error;
  }
}

export async function getProfile(id: string) {
    if (!id){
      throw new AppError("missing user id", HttpStatus.BAD_REQUEST);
    }
    // validate if the user id is valid
    const userObjectId = isValidObjectId(id)
    if (!userObjectId) {
      throw new AppError("invalid user id", HttpStatus.BAD_REQUEST);
    } 
    const userData = await collections.users!.findOne({ _id: userObjectId });
    console.log("User data fetched", userData)

    if (!userData) {
      throw new AppError("User Not Found", HttpStatus.BAD_REQUEST);
    }
    return userData;
}


export async function getAllUsers() {
  try {
    const result = (await collections.users!.find({}).toArray()) as User[];
    console.log(result)
    return result;
  } catch (error) {
    console.error("fail to get user", error);
  }
}