import { HttpStatus, MongoErrorStatus } from "../utils/http.status";
import jwt, { JwtPayload } from "jsonwebtoken";
import AppError from "../utils/app.error";
import bcrypt from "bcryptjs";


export const encryptPassword = async (password: string) => {
  const salt = await bcrypt.genSalt(10);
  password = await bcrypt.hash(password, salt);
  return password;
};

export const comparePassword = (password: string, hashedPassword: string) => {
  return bcrypt.compare(password, hashedPassword);
};

export const generateToken = (payload: string, role: string) => {
  const combined_payload =  {payload, role}
  const token = jwt.sign( combined_payload , "secret", { expiresIn: "5d"});
  return token;
};

export const verifyToken = (token: string) => {
  try {
    const decodedToken = jwt.verify(token, "secret")  as JwtPayload;
    return decodedToken;
  } catch (error) {
    throw new AppError("Authentication Fail, Invalid Token Signature", HttpStatus.UNAUTHORIZED);
  }
};

