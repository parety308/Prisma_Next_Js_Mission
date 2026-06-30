import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { commentService } from "./comment.service";
import { sendResponse } from "../../utils/sendResponse";
import HttpStatus from "http-status-codes";

const getAuthorComments = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.author_id;
    const result = await commentService.getAuthorCommentsFromDB(id as string) ?? [];
    sendResponse(res, {
        success: true,
        statusCode: HttpStatus.OK,
        message: "Comments Retrieve Successfully",
        data: result
    })
});
const getSingleComment = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.comment_id
    const result = await commentService.getSingleCommentFromDB(id as string) ?? [];
    sendResponse(res, {
        success: true,
        statusCode: HttpStatus.OK,
        message: "Comments Retrieve Successfully",
        data: result
    })
});
const createComment = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const id = req.user?.id;
    const result = await commentService.createCommentIntoDB(id as string, req.body);
    sendResponse(res, {
        success: true,
        statusCode: HttpStatus.CREATED,
        message: "Comment Created Successfully",
        data: result
    })
});
const updateComment = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.comment_id;
    const user_id = req.user?.id;
    const role = req.user?.role;
    const result = await commentService.updateCommentIntoDB(user_id as string, role as string, id as string, req.body) ?? [];
    sendResponse(res, {
        success: true,
        statusCode: HttpStatus.OK,
        message: "Comment Modified Successfully",
        data: result
    })
});
const deleteComment = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.comment_id;
    const user_id = req.user?.id;
    const role = req.user?.role;
    await commentService.deleteCommentFromDB(user_id as string, role as string, id as string) ?? [];
    sendResponse(res, {
        success: true,
        statusCode: HttpStatus.OK,
        message: "Comment Deleted Successfully",
        data: {}
    })
});
const updateModerateComment = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.comment_id;
    const role =req.user?.role;
    const result =await commentService.updateModerateCommentIntoDB(id as string,role as string,req.body)??[];
    sendResponse(res, {
        success: true,
        statusCode: HttpStatus.OK,
        message: "Comment Modified Successfully",
        data: result
    })
});

export const commentController = {
    getAuthorComments,
    getSingleComment,
    createComment,
    updateComment,
    updateModerateComment,
    deleteComment
}
