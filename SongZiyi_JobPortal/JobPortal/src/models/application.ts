import { ObjectId } from "mongodb";


/**
 * @openapi
 * components:
 *   schemas:
 *     CreateApplicationRequest:
 *       type: object
 *       properties:
 *         jobId:
 *           type: string
 *           default: 655151004d19194fdc620718
 *         userId: 
 *           type: string
 *           default: 655151004d19194fdc62071a
 *     CreateApplicationResponse:
 *       type: object
 *       properties:
 *         status:
 *           type: string
 *           default: success
 *         message: 
 *           type: string
 *           default: Application send.
 *         job: 
 *           type: object
 *           default: 
 *             status: "success"
 *             message: "application send"
 *             job: 
 *               _id: "654f55a90296abbbff32c8d5"
 *               jobId: "655151004d19194fdc620718"
 *               userId: "655151004d19194fdc62071a"
 *               applicationStatus: "applied"
 *               createdAt: "2023-11-11T10:21:29.817Z"
 *     GetUserApplicationsResponse:
 *       type: object
 *       properties:
 *         message: 
 *           type: string
 *           default: Get user's applications.
 *         userApplications: 
 *           type: object
 *           default: 
 *             status: "success"
 *             message: "application send"
 *             job: 
 *               _id: "655151004d19194fdc62071c"
 *               jobId: "655151004d19194fdc620718"
 *               applicationStatus: "applied"
 *               createdAt: "2023-11-11T20:55:52.118Z"
 */
export default class Application {
  constructor(
    public jobId: ObjectId, 
    public userId: ObjectId, 
    public applicationStatus: string,
    public createdAt?: Date, 
    public _id?: ObjectId, 
    ){}
}