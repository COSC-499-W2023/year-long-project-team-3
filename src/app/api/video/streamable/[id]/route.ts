import { type NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import logger from '@/utils/logger'
import { Video } from '@prisma/client'
import prisma from '@/lib/prisma'
import getStreamableUrl from '@/utils/getStreamableUrl'

export async function GET(req: NextRequest): Promise<NextResponse> {
    try {
        const session = await getServerSession()
        if (!session || !session.user?.email) {
            return NextResponse.json({ error: 'You must be signed in to upload a video' }, { status: 401 })
        }

        const videoId = req.nextUrl.pathname.split('/').pop()
        if (!videoId) {
            return NextResponse.json({ error: 'No videoId provided' }, { status: 500 })
        }

        const user = await prisma.user.findUniqueOrThrow({
            where: {
                email: session.user.email,
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

        const whitelistedUser = await prisma.videoWhitelistedUser.findUniqueOrThrow({
            where: {
                // eslint-disable-next-line camelcase
                whitelistedVideoId_whitelistedUserId: {
                    whitelistedUserId: user.id,
                    whitelistedVideoId: whitelistedVideo.id,
                },
            },
        })

        if (!whitelistedUser) {
            logger.error(`User ${ user.id } does not have permission to access video ${ videoId }`)
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
        }

        const video: Video = await prisma.video.findUniqueOrThrow({
            where: {
                id: videoId,
            },
        })

        const streamableUrl = await getStreamableUrl(video.s3Key as string)

        if (!streamableUrl) {
            logger.error(`Video ${ video.id } does not have a streamable url`)
            return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
        }

        return NextResponse.json({ videoUrl: streamableUrl }, { status: 200 })
    } catch (err) {
        logger.error(err)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
