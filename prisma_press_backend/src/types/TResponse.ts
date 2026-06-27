import type { TMeta } from "./TMeta";

export type TResponse<T> = {
    success: boolean;
    statusCode: number;
    message: string;
    data: T;
    meta?:TMeta
}