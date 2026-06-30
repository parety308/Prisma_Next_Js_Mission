import type { NextFunction, Request, Response } from "express";
import { catchAsync } from "../utils/catchAsync";
import { jwtUtils } from "../utils/jwt";
import { sendResponse } from "../utils/sendResponse";
import HttpStatus from "http-status-codes";
import { config } from "../config";
import { JwtPayload } from "jsonwebtoken";

const auth = (requiredRoles: string[]) => {
    return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const token = req.cookies.accessToken ||
            (req.headers.authorization?.startsWith("Bearer ") ?
                req.headers.authorization.split(" ")[1]
                : req.headers.authorization);
        if (!token) {
            throw new Error("Unauthorized Access");
        }
        const user = jwtUtils.verifyToken(token, config.jwt_access_token_secret);
          if (!user.success) {
            throw new Error(user.error);
        }
        if (!user) {
            throw new Error("User not found");
        }
        const { id, email, role, name } = user.data as JwtPayload;
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