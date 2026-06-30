import { PostStatus } from "../../../generated/prisma/enums";

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