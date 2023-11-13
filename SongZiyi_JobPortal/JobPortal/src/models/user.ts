import { ObjectId } from "mongodb";

/**
 * @openapi
 * components:
 *  schemas:
 *    UserRegisterInput:
 *      type: object
 *      required:
 *        - email
 *        - firstName
 *        - lastName
 *        - password
 *      properties:
 *        email:
 *          type: string
 *          default: user3@example.com
 *        firstName:
 *          type: string
 *          default: Emily
 *        lastName:
 *          type: string
 *          default: Tan
 *        password:
 *          type: string
 *          default: userpassword
 *    AdminUserRegisterInput:
 *      type: object
 *      required:
 *        - email
 *        - firstName
 *        - lastName
 *        - password
 *      properties:
 *        email:
 *          type: string
 *          default: admin1@example.com
 *        firstName:
 *          type: string
 *          default: April
 *        lastName:
 *          type: string
 *          default: Chen
 *        password:
 *          type: string
 *          default: userpassword
 *    GetProfileInput:
 *      type: object
 *      required:
 *        - userId
 *      properties:
 *        userId:
 *          type: string
 *          default: 655151004d19194fdc62071b
 *    GetProfileResponse:
 *      type: object
 *      required:
 *        - _id
 *        - email
 *        - firstName
 *        - lastName
 *        - password
 *        - role
 *      properties:
 *        _id:
 *          type: string
 *          default: 655151004d19194fdc62071b
 *        email:
 *          type: string
 *          default: user2@example.com
 *        firstName:
 *          type: string
 *          default: Jane
 *        lastName:
 *          type: string
 *          default: Doe
 *        password:
 *          type: string
 *          default: $2a$10$TQiYp7GPn.QZP1Jfkv.pG.U7H1ipUzbUqef86RWReiw4tioU18R3i
 *        role:
 *          type: string
 *          default: user
 *    UserRegisterResponse:
 *      type: object
 *      properties:
 *        status:
 *          type: string
 *          default: success
 *    UserLoginInput:
 *      type: object
 *      required:
 *        - email
 *        - password
 *      properties:
 *        email:
 *          type: string
 *          default: user3@example.com
 *        password:
 *          type: string
 *          default: userpassword
 *    AdminUserLoginInput:
 *      type: object
 *      required:
 *        - email
 *        - password
 *      properties:
 *        email:
 *          type: string
 *          default: admin1@example.com
 *        password:
 *          type: string
 *          default: userpassword
 *    AdminUserLoginResponse:
 *      type: object
 *      properties:
 *        status:
 *          type: string
 *          default: success
 *        token: 
 *          type: string
 *          default: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwYXlsb2FkIjoiNjU1MTUwNTcwYTFmMTc0Zjc0YTAyNTI0Iiwicm9sZSI6ImFkbWluIiwiaWF0IjoxNjk5ODI3ODAyLCJleHAiOjE3MDAyNTk4MDJ9.EfMYBNa3IoB0EYoi-XBb18DlZ8XUj9ZdK5_ZEj08zHE"
 * 
 *    UserLoginResponse:
 *      type: object
 *      properties:
 *        status:
 *          type: string
 *        token: 
 *          type: string
 *          default: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwYXlsb2FkIjoiNjU1MTUwM2YwYTFmMTc0Zjc0YTAyNTIzIiwicm9sZSI6InVzZXIiLCJpYXQiOjE2OTk4Mjc3NzgsImV4cCI6MTcwMDI1OTc3OH0.onqtv30pm2e64G7nObeUbUGzXLuHIRPmi68St3algCQ"
 */


export default class User {
  constructor(
    public email: string, 
    public firstName: string, 
    public lastName: string, 
    public password: string, 
    public role: string, 
    public phoneNumber?: string, 
    public _id?: ObjectId, 
    public education?: { school: string; degree: string }[],
    public resume?: string,
    public location?: string,
    public profession?: string,
    public image?: string,
    public experience?:Object,
    public skills?: string[]
    ){}
}




