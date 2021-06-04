import { Prisma, PrismaClient } from "@prisma/client";
import { Request, Response } from "express";

export type MyContext = {
    prisma: PrismaClient<Prisma.PrismaClientOptions, never, Prisma.RejectOnNotFound | Prisma.RejectPerOperation | undefined>;
    req: Request;
    res: Response;
}

export interface subsAuth {
    Authorization: string,
};