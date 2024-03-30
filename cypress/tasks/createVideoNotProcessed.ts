import prisma from '@/lib/prisma'

export type TestVideoCreationData = {
  ownerId: string
  title: string
  description: string
}

export default async function createOneVideoAndRetrieveVideoId(testVideoCreationData: TestVideoCreationData) {
    const video = await prisma.video.create({
        data: {
            owner: {
                connect: {
                    id: testVideoCreationData.ownerId,
                },
            },
            title: testVideoCreationData.title,
            description: testVideoCreationData.description,
            s3Key: 'notProcessed',
            isCloudProcessed: false,
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
            whitelistedUserId: testVideoCreationData.ownerId,
            whitelistedVideoId: videoWhitelist.id,
        },
    })

    return video.id
}
