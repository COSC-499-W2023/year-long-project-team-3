import prisma from '@/lib/prisma'

export const resetDB = async () => {
    await prisma.Account.deleteMany({})
    await prisma.User.deleteMany({})
}
