import { User } from "../interfaces/users";
import { Request } from "express";
import jwt, { Secret } from "jsonwebtoken";
import { admin } from "../interfaces/admin";

export function getTokenPayload(token: string): User | null {
  return jwt.verify(token, process.env.APP_SECRET as Secret) as User | null;
}

export function getUser(req: Request): User | null {
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

export function getTokenPayloadAdmin(token: string): admin | null {
  return jwt.verify(token, process.env.APP_SECRET as Secret) as admin | null;
}

export function getAdmin(req: Request): admin | null {
  const authHeader = req.headers.authorization;

  if (authHeader) {
    const token = authHeader.replace("Bearer ", "");

    if (!token) {
      return null;
    }

    const admin = getTokenPayloadAdmin(token);
    if (admin) {
      return admin;
    }
  }

  return null;
}
