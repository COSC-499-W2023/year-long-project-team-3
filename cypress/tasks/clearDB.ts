import prisma from '@/lib/prisma'

export default async function clearDB() {
    await prisma.videoWhitelistedUser.deleteMany({})
    await prisma.videoWhitelist.deleteMany({})
    await prisma.video.deleteMany({})
    await prisma.account.deleteMany({})
    await prisma.user.deleteMany({})

    return null
}
