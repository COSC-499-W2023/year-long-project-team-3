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

/**
 * Delete a video from the database by id.
 * @note This will also attempt to delete the video from s3 if it's cloud processed. However, if the video cannot be deleted from s3, the video will still be deleted from the database
 */
export async function DELETE(_: NextRequest, { params }: VideoDeleteParams): Promise<NextResponse> {
    const session = await getServerSession()
    if (!session || !session.user?.email) {
        return NextResponse.json({ error: 'You must be signed in to delete the video' }, { status: 401 })
    }
    const { videoId } = params
    if (!videoId) {
        return NextResponse.json({ error: 'No videoId provided' }, { status: 400 })
    }

    const video: Video | null = await prisma.video.findUnique({
        where: {
            id: videoId,
            owner: {
                email: session.user.email,
            },
        },
    })
    if (!video) {
        return NextResponse.json({ error: `Video ${ videoId } does not exist` }, { status: 400 })
    }

    try {
        const { s3Key, isCloudProcessed, isSubmitted } = video

        // If the video is cloud processed, we need to attempt to delete it from s3
        if (isCloudProcessed) {
            if (!s3Key) {
                // If cloud processed, but no s3Key, then it's a bug
                logger.error('Video is cloud processed but has no s3Key')
                return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
            }
            // Even when deleting video on s3 is failed, we still delete the video from database
            deleteS3StreamingVideo(getS3StreamingBucket(), s3Key)
                .catch((error) => {
                    logger.error(error)
                })
        }

        // Delete the whitelisted users that associated with the video
        await prisma.videoWhitelistedUser.deleteMany({
            where: {
                whitelistedVideo: {
                    videoId: videoId,
                },
            },
        })

        // Delete the whitelisted videos that associated with the video
        await prisma.videoWhitelist.deleteMany({
            where: {
                videoId: videoId,
            },
        })

        // If submitted, delete the submitted videos
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
