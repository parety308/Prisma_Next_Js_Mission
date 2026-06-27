import type { Response } from "express"
import type { TResponse } from "../types/TResponse"

export const sendResponse = async (res: Response, data: TResponse<Object>) => {
res.status(data.statusCode).json({
    success:data.success,
    statusCode:data.statusCode,
    message:data.message,
    data:data.data,
    meta:data.meta
})
}