import { Prisma, PrismaClient } from "@prisma/client";
import { validUser } from "../interfaces/validUser";

export async function addValidUser(
  useremail: string,
  prisma: PrismaClient<
    Prisma.PrismaClientOptions,
    never,
    Prisma.RejectOnNotFound | Prisma.RejectPerOperation | undefined
  >
): Promise<validUser | null> {
  const validuser = await prisma.validusers.create({
    data: {
      email: useremail,
    },
  });

  if (!validuser) {
    return null;
  }
  return validuser;
}
