import { PrismaClient } from '@prisma/client'
import * as brcypt from "bcrypt";
const prisma = new PrismaClient()

export async function main() {
    const superadmin = await prisma.roles.upsert({
        where: {
            rolename: process.env.SUPERADMIN_ROLE as string,
        },
        update: {},
        create: {
            adminsadd: true,
            adminsview: true,
            adminsedit: true,
            adminsdelete: true,
            videosadd: true,
            videosdelete: true,
            videosedit: true,
            videosview: true,
            commentsadd: true,
            commentsdelete: true,
            commentsedit: true,
            commentsview: true,
            usersadd: true,
            usersdelete: true,
            usersedit: true,
            usersview: true,
            rolesadd: true,
            rolesdelete: true,
            rolesedit: true,
            rolesview: true,
            isadmin: true,
            rolename: process.env.SUPERADMIN_ROLE as string,
        },
    });

    const admin = await prisma.admin.upsert({
        where: {
            email: process.env.SUPERADMIN_EMAIL as string,
        },
        update: {},
        create: {
            email: process.env.SUPERADMIN_EMAIL as string,
            name: process.env.SUPERADMIN_NAME as string,
            password: await brcypt.hash(process.env.SUPERADMIN_PASSWORD as string, 10),
            role: process.env.SUPERADMIN_ROLE as string,
        }
    });

    console.log(superadmin, admin);
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })