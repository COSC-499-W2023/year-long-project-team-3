import prisma from '@/lib/prisma'
import { v4 as uuidv4 } from 'uuid'

export type TestVideoCreationData = {
    ownerId?: string
    title: string
    description?: string
    submissionBoxId?: string
}

export default async function createOneVideoAndRetrieveVideoId(
    testVideoCreationData: TestVideoCreationData
): Promise<string> {
    let ownerId = testVideoCreationData.ownerId
    const { title, description } = testVideoCreationData

    if (!ownerId) {
        const fakeUser = await prisma.user.create({
            data: {
                email: 'user' + uuidv4() + '@example.com',
            },
        })
        ownerId = fakeUser.id
    }

    const video = await prisma.video.create({
        data: {
            owner: {
                connect: {
                    id: ownerId,
                },
            },
            title: title,
            description: description,
            s3Key: 'test',
            isCloudProcessed: true,
            processedVideoUrl: '/videos/lemons.mp4',
            thumbnail: '/images/quagmire.jpeg',
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
