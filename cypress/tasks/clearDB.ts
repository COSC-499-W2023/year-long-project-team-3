import prisma from '@/lib/prisma'

export const clearDB = async () => {
    await prisma.account.deleteMany({})
    await prisma.user.deleteMany({})
    return null
}
