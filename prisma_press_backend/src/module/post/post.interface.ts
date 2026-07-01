import { PostStatus } from "../../../generated/prisma/enums";
import { PostWhereInput } from "../../../generated/prisma/models";

export type TCreatePostPayload = {
    title: string;
    content: string;
    thumbnail?: string;
    isFeatured?: boolean;
    status?: PostStatus
    tags: string[]
};
export type TUpdatePostPayload = {
    title?: string;
    content?: string;
    thumbnail?: string;
    isFeatured?: boolean;
    status?: PostStatus
    tags?: string[]
};

export interface IPostQuery extends PostWhereInput{
    searchTerm?: string;
    page?: string;
    limit?: string;
    sortOrder?: string;
    sortBy?: string
}