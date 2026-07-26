import jwt from "jsonwebtoken";
import { env } from "../../config/env";

export type JwtPayload = {
  sub: string;
  email: string;
  role: string;
};

const SIGN_OPTIONS: jwt.SignOptions = {
  expiresIn: env.jwtExpiresIn as jwt.SignOptions["expiresIn"],
  algorithm: "HS256",
};

const VERIFY_OPTIONS: jwt.VerifyOptions = {
  algorithms: ["HS256"],
};

export function signToken(payload: JwtPayload): string {
  return jwt.sign(payload, env.jwtSecret, SIGN_OPTIONS);
}

export function verifyToken(token: string): JwtPayload {
  return jwt.verify(token, env.jwtSecret, VERIFY_OPTIONS) as JwtPayload;
}
