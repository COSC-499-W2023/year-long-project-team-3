import prisma from '@/lib/prisma'

export type TestVideoCreationData = {
    ownerId: string
    title: string
}

export default async function createOneVideoAndRetrieveVideoId(
    testVideoCreationData: TestVideoCreationData
): Promise<string> {
    const { ownerId, title } = testVideoCreationData

    const video = await prisma.video.create({
        data: {
            owner: {
                connect: {
                    id: ownerId,
                },
            },
            title: title,
            s3Key: 'test',
        },
    })

    const videoWhitelist = await prisma.videoWhitelist.create({
        data: {
            video: {
                connect: {
                    id: video.id,
                },
            },
        },
    })

    await prisma.videoWhitelistedUser.create({
        data: {
            whitelistedUserId: ownerId,
            whitelistedVideoId: videoWhitelist.id,
        },
    })

    return video.id
}
