import prisma from '@/lib/prisma'

export default async function clearDB() {
    await prisma.account.deleteMany({})
    await prisma.user.deleteMany({})
}
