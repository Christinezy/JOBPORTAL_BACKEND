import { HttpStatus } from "./http.status";


/**
 * @openapi
 * components:
 *   schemas:
 *     Error400Response:
 *       type: object
 *       properties:
 *         error_code:
 *           type: integer
 *           default: 400
 *           description: Http status error code.
 *         error_message:
 *           type: string
 *           default: Invalid parameters or missing parameters.
 *       required:
 *         - error_code
 *         - error_message
 *     Error409Response:
 *       type: object
 *       properties:
 *         error_code:
 *           type: integer
 *           default: 409
 *           description: Http status error code.
 *         error_message:
 *           type: string
 *           default: Resource already exists or has other conflicting information.
 *       required:
 *         - error_code
 *         - error_message
 *     Error500Response:
 *       type: object
 *       properties:
 *         error_code:
 *           type: integer
 *           default: 500
 *           description: Http status error code.
 *         error_message:
 *           type: string
 *           default: Internal Server Error.
 *       required:
 *         - error_code
 *         - error_message
 *     Error401Response:
 *       type: object
 *       properties:
 *         error_code:
 *           type: integer
 *           default: 401
 *           description: Http status error code.
 *         error_message:
 *           type: string
 *           default: Authentication Fail.
 *       required:
 *         - error_code
 *         - error_message
 *     Error403Response:
 *       type: object
 *       properties:
 *         error_code:
 *           type: integer
 *           default: 403
 *           description: Http status error code.
 *         error_message:
 *           type: string
 *           default: No permission to access.
 *       required:
 *         - error_code
 *         - error_message
 */
class AppError extends Error {
    statusCode: number; 
    errorMessage: string;
    constructor(message: string, statusCode: HttpStatus) {
      super(message);
      this.statusCode = statusCode;
      this.errorMessage = message
      Error.captureStackTrace(this, this.constructor);
    }
}
export default AppError;