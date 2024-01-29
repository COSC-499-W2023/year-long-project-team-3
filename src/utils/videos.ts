import prisma from '@/lib/prisma'

export async function getWhitelistedUser(userEmail: string, videoId: string) {
    const user = await prisma.user.findUniqueOrThrow({
        where: {
            email: userEmail,
        },
        select: {
            id: true,
        },
    })

    const whitelistedVideo = await prisma.videoWhitelist.findUniqueOrThrow({
        where: {
            videoId: videoId,
        },
    })

    return prisma.videoWhitelistedUser.findUnique({
        where: {
            // eslint-disable-next-line camelcase
            whitelistedVideoId_whitelistedUserId: {
                whitelistedUserId: user.id,
                whitelistedVideoId: whitelistedVideo.id,
            },
        },
    })
}
