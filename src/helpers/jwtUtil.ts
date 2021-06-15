import { User } from "../interfaces/users";
import { Request } from "express";
import jwt, { Secret } from "jsonwebtoken";
import { admin } from "../interfaces/admin";

export function getTokenPayload(token: string): admin | User | null {
  return jwt.verify(token, process.env.APP_SECRET as Secret) as admin | User | null;
}

export function getUser(req: Request): admin | User | null {
  const authHeader = req.headers.authorization;

  if (authHeader) {
    const token = authHeader.replace("Bearer ", "");

    if (!token) {
      return null;
    }

    const user = getTokenPayload(token);
    if (user) {
      return user;
    }
  }

  return null;
}
