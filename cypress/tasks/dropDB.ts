import prisma from '@/lib/prisma'

/**
 * Drop all tables in the database
 */
export const dropDB = async () => {
    await prisma.video.deleteMany({})
    await prisma.account.deleteMany({})
    await prisma.user.deleteMany({})
}
