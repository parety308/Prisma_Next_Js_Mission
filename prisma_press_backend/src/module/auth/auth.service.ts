import bcrypt from "bcryptjs";
import { prisma } from "../../lib/prisma"
import type { TPayload } from "../../types/TPayload"
import jwt, { type SignOptions } from "jsonwebtoken";
import { config } from "../../config";
import { jwtUtils } from "../../utils/jwt";
const loginUserIntoDB = async (payload: TPayload) => {
    const user = await prisma.user.findUniqueOrThrow({
        where: { email: payload.email }
    });

    const isPasswordMatched = await bcrypt.compare(payload.password, user.password);
    if (!isPasswordMatched) {
        throw new Error("Password is incorrect");
    };

    const jwtPayload = {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
    }
    // const accessToken = await jwt.sign(jwtPayload, config.jwt_access_token_secret as string, { expiresIn:config.jwt_access_expires_in });
    const accessToken = jwtUtils.createToken(
        jwtPayload,
        config.jwt_access_token_secret,
        config.jwt_access_expires_in
    );

    const refreshToken = jwtUtils.createToken(
        jwtPayload,
        config.jwt_refresh_secret,
        config.jwt_refresh_expires_in
    );

    return {
        accessToken,
        refreshToken
    };
}

export const authService = { loginUserIntoDB }