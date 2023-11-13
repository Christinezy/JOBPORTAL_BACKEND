import { ObjectId } from "mongodb";

/**
 * @openapi
 * components:
 *  schemas:
 *    AddJobInput:
 *      type: object
 *      required:
 *        - title
 *        - description
 *        - active
 *        - company
 *      properties:
 *        title:
 *          type: string
 *          default: HR
 *        description:
 *          type: string
 *          default: Hr for hiring seniors
 *        active:
 *          type: boolean
 *          default: true
 *        company:
 *          type: string
 *          default: Aureus Group
 *    AddJobResponse:
 *      type: object
 *      properties:
 *        status:
 *          type: string
 *          default: success
 *        message: 
 *          type: string
 *          default: Job created successfully.
 *        job: 
 *          type: object
 *          default: {_id: 654fd9b916c634f02cec8d4b,title: 'HR', description: 'Hr for hiring seniors', active: true, company: 'Aureus Group', "postedAt": "2023-11-12T18:36:11.020Z"} 
 *    GetJobDataResponse:
 *      type: object
 *      properties:
 *        jobData: 
 *          type: object
 *          default: {_id: 655151004d19194fdc620718,title: 'Software Engineer', description: 'Job description...', active: true, company: 'CompanyA', salary: '8000', location: "UK"} 
 *    DeleteJobResponse:
 *      type: object
 *      properties:
 *        status:
 *          type: string
 *          default: success
 *        message: 
 *          type: string
 *          default: Job deleted successfully.
 * 
 *    ListJobResponse:
 *      type: object
 *      properties:
 *        status:
 *          type: string
 *        alljob: 
 *          type: object
 *          default: [{"_id": "654fdcc81cf33bf0f04828e7", "title": "Software Engineer", "description": "Job description...","active": true,"company": "CompanyA","salary": "8000", "location": "UK"}] 
 * 
 */

export default class Job {
  constructor(
    public title: string, 
    public description: string, 
    public active: boolean, 
    public company: string,
    public postedAt?: Date,
    public _id?: ObjectId, 
    public salary?: string,
    public image?: string, 
    public location?: string,
    ){}
}