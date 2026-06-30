import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { postService } from "./post.service";
import { sendResponse } from "../../utils/sendResponse";
import HttpStatus from "http-status-codes";

const getAllPosts = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const result = await postService.getAllPostsFromDB();
    sendResponse(res, {
        success: true,
        statusCode: HttpStatus.OK,
        message: "All Posts Retrieve Successfully",
        data: result
    })
});

const getPostStats = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const result = await postService.getPostStatsFromDB();
    sendResponse(res, {
        success: true,
        statusCode: HttpStatus.OK,
        message: "Posts stats Retrieve Successfully",
        data: result
    })
});

const getMyPosts = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const id = req.user?.id;
    const result = await postService.getMyPostsFromDB(id as string);
    sendResponse(res, {
        success: true,
        statusCode: HttpStatus.OK,
        message: "My Posts Retrieve Successfully",
        data: result
    })
});

const getSinglePost = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const post_id = req.params.post_id;
    const result = await postService.getSinglePostFromDB(post_id as string);
    sendResponse(res, {
        success: true,
        statusCode: HttpStatus.OK,
        message: "Post Retrieve Successfully",
        data: result
    })
});
const createPost = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const id = req.user?.id;
    const result = await postService.createPostIntoDB(req.body, id as string);
    sendResponse(res, {
        success: true,
        statusCode: HttpStatus.CREATED,
        message: "Post Created Successfully",
        data: result
    })
});
const updatePost = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const author_id = req.user?.id;
    const isAdmin = req.user?.role === "admin";
    const { post_id } = req.params;
    const result = await postService.updatePostIntoDB(post_id as string, req.body, author_id as string, isAdmin);
    sendResponse(res, {
        success: true,
        statusCode: HttpStatus.OK,
        message: "Post Modified Successfully",
        data: result
    })
});
const deletePost = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const author_id = req.user?.id;
    const isAdmin = req.user?.role === "admin";
    const { post_id } = req.params;
    await postService.deletePostFromDB(post_id as string, author_id as string, isAdmin);
    sendResponse(res, {
        success: true,
        statusCode: HttpStatus.OK,
        message: "Post Modified Successfully",
        data: []
    })
});


export const postController = { getAllPosts, getMyPosts, getSinglePost, getPostStats, createPost, updatePost, deletePost };