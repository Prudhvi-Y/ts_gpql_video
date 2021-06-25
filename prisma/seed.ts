import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

export async function seed() {
    const superadmin = await prisma.roles.upsert({
        where: {
            rolename: process.env.SUPERADMIN_ROLE,
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
            isadmin: true,
            rolename: process.env.SUPERADMIN_ROLE,
        },
    })

    const admin = await prisma.admin.upsert({
        where: {
            email: process.env.SUPERADMIN_EMAIL,
        },
        update: {},
        create: {
            admin: true,
            email: process.env.SUPERADMIN_EMAIL,
            name: process.env.SUPERADMIN_NAME,
            password: process.env.SUPERADMIN_PASSWORD,
            role: process.env.SUPERADMIN_ROLE,
        }
    })
}