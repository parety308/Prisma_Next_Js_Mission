import { CommentStatus, Prisma, Role, User } from "../../../generated/prisma/client";
import { prisma } from "../../lib/prisma";
import { TCommentPayload } from "./comment.interface";

const getAuthorCommentsFromDB = async (author_id: string) => {
    try {
        await prisma.user.findFirstOrThrow({
            where: {
                id: author_id
            }
        })
        const result = await prisma.comment.findMany({
            where: {
                author_id
            }
        });
        return result;
    } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            throw new Error("Author not found");
        }
    }
};

const getSingleCommentFromDB = async (id: string) => {
    try {
        const result = await prisma.comment.findUniqueOrThrow({
            where: {
                id
            }
        });
        return result;

    } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            throw new Error("Author not found");
        }
    }
};
const createCommentIntoDB = async (author_id: string, payload: TCommentPayload) => {

    const result = await prisma.comment.create({
        data: {
            content: payload.content,
            post_id: payload.post_id,
            author_id: author_id
        }

    });
    return result;
};
const updateCommentIntoDB = async (author_id: string, author_role: string, id: string, payload: { content: string }) => {
    try {

        const comment = await prisma.comment.findFirstOrThrow({
            where: {
                id
            }
        });
        if (!(comment.author_id === author_id) && !(author_role === Role.admin)) {
            throw new Error("Forbidden Access")
        }
        const result = await prisma.comment.update({
            where: { id },
            data: payload
        });
        return result;
    } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            throw new Error("Comment not found");
        }
    }
};
const deleteCommentFromDB = async (author_id: string, author_role: string, id: string) => {
    try {

        const comment = await prisma.comment.findFirstOrThrow({
            where: {
                id
            }
        });
        if (!(comment.author_id === author_id) && !(author_role === Role.admin)) {
            throw new Error("Forbidden Access")
        }
        const result = await prisma.comment.delete({
            where: { id }
        });
        return result;
    } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            throw new Error("Comment not found");
        }
    }
};
const updateModerateCommentIntoDB = async (id: string, author_role: string, payload: { status: CommentStatus }) => {
    try {

        await prisma.comment.findFirstOrThrow({
            where: {
                id
            }
        });
        if (!(author_role === Role.admin)) {
            throw new Error("Forbidden Access")
        }
        const result = await prisma.comment.update({
            where: { id },
            data: {
                status: payload.status
            }
        });
        return result;
    } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            throw new Error("Comment not found");
        }
    }
};


export const commentService = {
    getAuthorCommentsFromDB,
    getSingleCommentFromDB,
    createCommentIntoDB,
    updateCommentIntoDB,
    updateModerateCommentIntoDB,
    deleteCommentFromDB
}