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

export const jwtUtils = { createToken };