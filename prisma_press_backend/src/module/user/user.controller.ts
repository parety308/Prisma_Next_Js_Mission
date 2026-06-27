import type { NextFunction, Request, Response } from "express";
import HttpStatus from "http-status-codes";
import { userService } from "./user.service";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";


// const catchAsync = (fn: RequestHandler) => {
//   return async (req: Request, res: Response, next: NextFunction) => {
//     try {
//       await fn(req, res, next);
//     } catch (error) {
//       res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
//         success: false,
//         statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
//         message: "An error occurred",
//         error: (error as Error).message,
//       });
//     }
//   };
// };





const registerUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const user = await userService.registerUserIntoDB(req.body);

    // res.status(HttpStatus.CREATED).json({
    //     ,
    //    
    //   
    //     data: {
    //         
    //     }
    // });
    sendResponse(res, {
        success: true,
        statusCode: HttpStatus.CREATED,
        message: "User registered successfully",
        data: { user }
    })
})



export default { registerUser }