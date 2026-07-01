import { CommentStatus, PostStatus } from "../../../generated/prisma/enums";
import { PostWhereInput } from "../../../generated/prisma/models";
import { prisma } from "../../lib/prisma";
import { IPostQuery, TCreatePostPayload, TUpdatePostPayload } from "./post.interface";


const getAllPostsFromDB = async (query: IPostQuery) => {
    const limit = query.limit ? Number(query.limit) : 3;
    const page = query.page ? Number(query.page) : 1;
    const sortBy = query.sortBy ?? "createdAt";
    const sortOrder = query.sortOrder ?? "desc";
    const tags = JSON.parse(query.tags as string) ?? null;
    const tagsArray = Array.isArray(query.tags) ? tags : [];
    const andCondition: PostWhereInput[] = []
    if (query.searchTerm) {
        andCondition.push({
            OR: [
                {
                    title: {
                        contains: query.searchTerm,
                        mode: 'insensitive'
                    }
                },
                {
                    content: {
                        contains: query.searchTerm,
                        mode: 'insensitive'
                    }
                }
            ]
        })
    }

    if (query.title) {
        andCondition.push({
            title: query.title
        });
    }

    if (query.content) {
        andCondition.push({
            content: query.content
        });
    }

    if (query.author_id) {
        andCondition.push({
            author_id: query.author_id
        });
    }

    if (query.isFeatured) {
        andCondition.push({
            isFeatured: Boolean(query.isFeatured)
        });
    }

    if (query.tags) {
        andCondition.push({
            tags: {
                hasSome: tagsArray
            }
        })
    }
    if (query.status) {
        andCondition.push({
            status: query.status
        })
    }
    const result = await prisma.post.findMany({
        // where: {
        //implement filtering (exact match)
        // AND: [
        //     {
        //         title: "My Second Post"
        //     },
        //     {
        //         content: "Content of the post goes here-2."
        //     }
        // ]


        //searching or partial match

        // title:{
        //     contains:"post",
        //     mode:"insensitive"
        // }

        //searching or partial match using or
        // OR: [{
        //     title: {
        //         contains: "first",
        //         mode: "insensitive"
        //     }
        // },
        // {
        //     content:{
        //         contains:"here-2"
        //     }
        // }
        //     ]

        //filtering and searching combine

        // AND: [{
        //     OR: [{
        //         title: {
        //             contains: "first",
        //             mode: "insensitive"
        //         }
        //     },
        //     {
        //         content: {
        //             contains: "here-2"
        //         }
        //     }
        //     ]
        // },
        // {
        //     title: "My First Post"
        // }, {
        //     content: "content of first post"
        // }

        // ]
        // },


        where: {
            // AND: [
            //     //searching
            //     query.searchTerm ? {
            //         OR: [
            //             {
            //                 title: {
            //                     contains: query.searchTerm,
            //                     mode: 'insensitive'
            //                 }
            //             },
            //             {
            //                 content: {
            //                     contains: query.searchTerm,
            //                     mode: 'insensitive'
            //                 }
            //             }
            //         ]
            //     } : {},


            //     //title filtering

            //     query.title ? { title: query.title } : {},
            //     query.content ? { content: query.content } : {}
            // ]
        }
        ,
        take: limit,
        skip: (page - 1) * limit,
        orderBy: {
            [sortBy]: sortOrder
        },
        include: {
            author: {
                omit: {
                    password: true,
                    createdAt: true,
                    updatedAt: true
                }
            },
            comments: true
        }
    });
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