import { User } from "../interfaces/users";
import { Request } from "express";
import jwt, { Secret } from "jsonwebtoken";
import { admin } from "../interfaces/admin";
import { Prisma, PrismaClient } from "@prisma/client";

export function getTokenPayload(token: string): User | null {
  return jwt.verify(token, process.env.APP_SECRET as Secret) as User | null;
}

export async function getUser(
  req: Request,
  prisma: PrismaClient<
    Prisma.PrismaClientOptions,
    never,
    Prisma.RejectOnNotFound | Prisma.RejectPerOperation | undefined
  >
): Promise<User | null> {
  const authHeader = req.headers.authorization;

  if (authHeader) {
    const token = authHeader.replace("Bearer ", "");

    const valid = await prisma.validlogin.findFirst({
      where: {
        id: token
      },
    });
    if (!valid || !valid.valid) {
      return null;
    }

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

export async function getAdmin(
  req: Request,
  prisma: PrismaClient<
    Prisma.PrismaClientOptions,
    never,
    Prisma.RejectOnNotFound | Prisma.RejectPerOperation | undefined
  >
): Promise<admin | null> {
  const authHeader = req.headers.authorization;

  if (authHeader) {
    const token = authHeader.replace("Bearer ", "");

    const valid = await prisma.validlogin.findFirst({
      where: {
        id: token
      },
    });
    if (!valid || !valid.valid) {
      return null;
    }

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

export function getToken(req: Request): string | null {
  const authHeader = req.headers.authorization;

  if (authHeader) {
    const token = authHeader.replace("Bearer ", "");

    if (!token) {
      return null;
    }

    return token;
  }

  return null;
}
