import type { NextFunction, Request, Response } from "express";
import HttpStatus from "http-status-codes";
import { userService } from "./user.service";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";

const registerUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const user = await userService.registerUserIntoDB(req.body);
    sendResponse(res, {
        success: true,
        statusCode: HttpStatus.CREATED,
        message: "User registered successfully",
        data: { user }
    });
});


const getUserProfile = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const userProfile = await userService.getUserProfileFromDB(req.user?.id);
    sendResponse(res, {
        success: true,
        statusCode: HttpStatus.OK,
        message: "User Profile Retrieve Successfully",
        data: { userProfile }
    });
});

const updateUserProfile = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const userProfile = await userService.updateUserProfileIntoDB(req.user?.id as string,req.body);
    res.send(userProfile);
});



export default { registerUser, getUserProfile ,updateUserProfile}