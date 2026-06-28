import type { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { authService } from "./auth.service";
import { sendResponse } from "../../utils/sendResponse";
import HttpStatus from "http-status-codes";
const loginUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    const {accessToken,refreshToken} = await authService.loginUserIntoDB(req.body);

    res.cookie("accessToken",accessToken,{
        httpOnly:true,
        secure:false,
        sameSite:"none",
        maxAge:1000*60*60*24 //one day
    });

    res.cookie("refreshToken",refreshToken,{
        httpOnly:true,
        secure:false,
        sameSite:"none",
        maxAge:1000*60*60*24*7 //one day
    });

    sendResponse(res, {
        success: true,
        statusCode: HttpStatus.OK,
        message: "User Login Successfully",
        data: {accessToken,refreshToken}
    });
})

export const authController = { loginUser };