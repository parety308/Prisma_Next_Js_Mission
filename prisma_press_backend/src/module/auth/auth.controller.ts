import type { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { authService } from "./auth.service";
import { sendResponse } from "../../utils/sendResponse";
import HttpStatus from "http-status-codes";
const loginUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    const loginUser = await authService.loginUserIntoDB(req.body);

    sendResponse(res, {
        success: true,
        statusCode: HttpStatus.OK,
        message: "User Login Successfully",
        data: loginUser
    });
})

export const authController = { loginUser };