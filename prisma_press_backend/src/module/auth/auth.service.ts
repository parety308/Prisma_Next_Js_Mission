import bcrypt from "bcryptjs";
import { prisma } from "../../lib/prisma"
import type { TPayload } from "../../types/TPayload"
import { config } from "../../config";
import { jwtUtils } from "../../utils/jwt";
import { JwtPayload } from "jsonwebtoken";

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

const refreshTokenDB = async (refreshToken: string) => {
    const verifiedRefreshToken = jwtUtils.verifyToken(refreshToken, config.jwt_refresh_secret);
    if (!verifiedRefreshToken.success) {
        throw new Error(verifiedRefreshToken.error);
    };

    const { id } = verifiedRefreshToken as JwtPayload;
    const user = await prisma.user.findFirstOrThrow({
        where: { id }
    });

    if (user.active_status === "blocked") {
        throw new Error("User is Blocked");
    };
    const jwtPayload = {
        id,
        name: user.name,
        email: user.email,
        role: user.role
    };

    const accessToken = jwtUtils.createToken(jwtPayload, config.jwt_access_token_secret, config.jwt_access_expires_in);
    return { accessToken };
}
export const authService = { loginUserIntoDB, refreshTokenDB }