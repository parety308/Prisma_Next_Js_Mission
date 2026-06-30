import type { JwtPayload } from "jsonwebtoken";
import jwt from "jsonwebtoken";


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

const verifyToken = (token: string, secret: string) => {
  try {
    const verifiedToken = jwt.verify(token, secret);
    return {
      success: true,
      data: verifiedToken
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message
    }
  }
}

export const jwtUtils = { createToken, verifyToken };