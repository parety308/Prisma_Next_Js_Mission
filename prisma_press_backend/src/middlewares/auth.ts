import type { NextFunction, Request, Response } from "express";
import { catchAsync } from "../utils/catchAsync";
import { jwtUtils } from "../utils/jwt";
import { sendResponse } from "../utils/sendResponse";
import HttpStatus from "http-status-codes";

const auth = (requiredRoles: string[]) => {
    return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const token = req.cookies.accessToken ||
            (req.headers.authorization?.startsWith("Bearer ") ?
                req.headers.authorization.split(" ")[1]
                : req.headers.authorization);
        if (!token) {
            throw new Error("Unauthorized Access");
        }
        const user = jwtUtils.verifyToken(token);
        if (typeof user === "string") {
            throw new Error(user);
        }
        if (!user) {
            throw new Error("User not found");
        }
        const { id, email, role, name } = user;
        if (requiredRoles.length && !requiredRoles.includes(role)) {
            sendResponse(res, {
                success: false,
                statusCode: HttpStatus.FORBIDDEN,
                message: "Forbidden Access",
                data: {}
            });
        }
        req.user = { id, name, email, role };
        next();
    });
}
export default auth;