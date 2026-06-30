import { CommentStatus, PostStatus } from "../../../generated/prisma/enums";
import { prisma } from "../../lib/prisma";
import { TCreatePostPayload, TUpdatePostPayload } from "./post.interface";


const getAllPostsFromDB = async () => {
    const result = await prisma.post.findMany();
    return result;
};

const getPostStatsFromDB = async () => {
    const transactionsResult = await prisma.$transaction(
        async (tx) => {
            // const totolPosts = await tx.post.count();
            // const totalPublishedPosts = await tx.post.count({
            //     where: {
            //         status: PostStatus.published
            //     }
            // })
            // const totalDraftPosts = await tx.post.count({
            //     where: {
            //         status: PostStatus.draft
            //     }
            // })
            // const totalArchievedPosts = await tx.post.count({
            //     where: {
            //         status: PostStatus.archieve
            //     }
            // })

            // const totolComment = await tx.comment.count();
            // const totalApproveComment = await tx.comment.count({
            //     where: {
            //         status: CommentStatus.approved
            //     }
            // })
            // const totalRejectComment = await tx.comment.count({
            //     where: {
            //         status: CommentStatus.rejected
            //     }
            // });
            // return {
            // totolPosts,
            // totalPublishedPosts,
            // totalArchievedPosts,
            // totalDraftPosts,
            // totolComment,
            // totalApproveComment,
            // totalRejectComment
            // }

            const [totolPosts,
                totalPublishedPosts,
                totalArchievedPosts,
                totalDraftPosts,
                totolComment,
                totalApproveComment,
                totalRejectComment,
                totalPostViewsAggregate] = await Promise.all([
                    await tx.post.count(),
                    await tx.post.count({
                        where: {
                            status: PostStatus.published
                        }
                    }),
                    await tx.post.count({
                        where: {
                            status: PostStatus.draft
                        }
                    }),
                    await tx.post.count({
                        where: {
                            status: PostStatus.archieve
                        }
                    }),
                    await tx.comment.count(),
                    await tx.comment.count({
                        where: {
                            status: CommentStatus.approved
                        }
                    }),
                    await tx.comment.count({
                        where: {
                            status: CommentStatus.rejected
                        }
                    }),
                    await tx.post.aggregate({
                        _sum: {
                            views: true
                        }
                    })
                ]);
            return {
                totolPosts,
                totalPublishedPosts,
                totalArchievedPosts,
                totalDraftPosts,
                totolComment,
                totalApproveComment,
                totalRejectComment,
                totalPostViews: totalPostViewsAggregate._sum.views
            }
        }

    )
    return transactionsResult;
};

const getMyPostsFromDB = async (user_id: string) => {
    const result = await prisma.post.findMany({
        where: { author_id: user_id }
    });
    return result;
};

const getSinglePostFromDB = async (post_id: string) => {

    const transactionResult = await prisma.$transaction(
        async (tx) => {
            await tx.post.update({
                where: { id: post_id },
                data: {
                    views: {
                        increment: 2
                    }
                }
            });

            const result = await tx.post.findFirstOrThrow({
                where: { id: post_id },
                include: {
                    author: {
                        omit: {
                            password: true
                        }
                    },
                    comments: {
                        where: {
                            status: CommentStatus.approved
                        },
                        orderBy: {
                            createdAt: 'desc'
                        },
                    },
                    _count: {
                        select: {
                            comments: true
                        }
                    }
                }
            });
            return result;
        }
    );
    return transactionResult;
}

const createPostIntoDB = async (payload: TCreatePostPayload, user_id: string) => {

    const result = await prisma.post.create({
        data: {
            ...payload,
            author_id: user_id,
        }
    });

    return result;

};

const updatePostIntoDB = async (post_id: string, payload: TUpdatePostPayload, author_id: string, isAdmin: boolean) => {

    const post = await prisma.post.findFirstOrThrow({
        where: { id: post_id }
    });

    if (!(post.author_id === author_id) && !(isAdmin)) {
        throw new Error("Unauthorized Action")
    }
    const result = await prisma.post.update({
        where: {
            id: post_id
        },
        data: payload
    })
    return result;
};

const deletePostFromDB = async (post_id: string, author_id: string, isAdmin: boolean) => {
    const post = await prisma.post.findFirstOrThrow({
        where: { id: post_id }
    });

    if (!(post.author_id === author_id) && !(isAdmin)) {
        throw new Error("Unauthorized Action")
    }
    await prisma.post.delete({
        where: { id: post_id }
    });

};

export const postService = {
    getAllPostsFromDB,
    getMyPostsFromDB,
    getPostStatsFromDB,
    getSinglePostFromDB,
    createPostIntoDB,
    updatePostIntoDB,
    deletePostFromDB
}