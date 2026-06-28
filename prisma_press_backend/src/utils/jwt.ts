import type { JwtPayload } from "jsonwebtoken";
import jwt from "jsonwebtoken";
import { config } from "../config";

const createToken = (
  payload: JwtPayload,
  secret: string,
  expiresIn: string | number
) => {
  const token = jwt.sign(
    payload,
    secret,
    {
      expiresIn: expiresIn as jwt.SignOptions["expiresIn"]
    }
  );

  return token;
};

const verifyToken = (token: string) => {
  try {
    const verifiedToken = jwt.verify(token, config.jwt_access_token_secret);
    return verifiedToken;
  } catch (error) {
    throw new Error("Invalid Token");
  }
}

export const jwtUtils = { createToken, verifyToken };