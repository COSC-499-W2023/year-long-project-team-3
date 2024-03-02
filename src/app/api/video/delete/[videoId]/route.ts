import logger from '@/utils/logger'
import { getServerSession } from 'next-auth'
import { type NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { Video } from '@prisma/client'
import deleteS3StreamingVideo from '@/utils/deleteS3StreamingVideo'
import { getS3StreamingBucket } from '@/utils/getS3UploadBucket'

export type VideoDeleteParams = {
    params: {
        videoId: string
    }
}

export async function DELETE(_: NextRequest, { params }: VideoDeleteParams): Promise<NextResponse> {
    const session = await getServerSession()
    if (!session || !session.user?.email) {
        return NextResponse.json({ error: 'You must be signed in to edit the video' }, { status: 401 })
    }
    const { videoId } = params
    if (!videoId) {
        return NextResponse.json({ error: 'No videoId provided' }, { status: 400 })
    }

    try {
        const video: Video = await prisma.video.findUniqueOrThrow({
            where: {
                id: videoId,
                owner: {
                    email: session.user.email,
                },
            },
        })

        const { s3Key, isCloudProcessed, isSubmitted } = video
        if (!s3Key) {
            // If cloud processed, but no s3Key, then it's a bug
            logger.error('Video is cloud processed but has no s3Key')
            return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
        }

        if (isCloudProcessed) {
            await deleteS3StreamingVideo(getS3StreamingBucket(), s3Key)
        }

        await prisma.videoWhitelistedUser.deleteMany({
            where: {
                whitelistedVideo: {
                    videoId: videoId,
                },
            },
        })

        await prisma.videoWhitelist.deleteMany({
            where: {
                videoId: videoId,
            },
        })

        if (isSubmitted) {
            await prisma.submittedVideo.deleteMany({
                where: {
                    videoId: videoId,
                },
            })
        }

        await prisma.video.delete({
            where: {
                id: videoId,
            },
        })

        return NextResponse.json({ success: true }, { status: 200 })
    } catch (error) {
        logger.error(error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
