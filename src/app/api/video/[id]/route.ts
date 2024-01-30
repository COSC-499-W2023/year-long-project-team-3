import { type NextRequest, NextResponse } from 'next/server'
import logger from '@/utils/logger'
import { getServerSession } from 'next-auth'
import prisma from '@/lib/prisma'
import { type Video } from '@prisma/client'
import { getWhitelistedUser } from '@/utils/videos'

export async function GET(req: NextRequest): Promise<NextResponse> {
    try {
        const session = await getServerSession()
        if (!session || !session.user?.email) {
            return NextResponse.json({ error: 'You must be signed in to view a video' }, { status: 401 })
        }

        const videoId = req.nextUrl.pathname.split('/').pop()
        if (!videoId) {
            return NextResponse.json({ error: 'No videoId provided' }, { status: 400 })
        }

        if (!(await getWhitelistedUser(session.user.email, videoId))) {
            logger.error(`User ${ session.user.email } does not have permission to access video ${ videoId }`)
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
        }

        const video: Video = await prisma.video.findUniqueOrThrow({
            where: {
                id: videoId,
            },
        })

        if (video.processedVideoUrl === null && video.isCloudProcessed) {
            logger.error(`Video ${ video.id } does not have a streamable url`)
            return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
        }
        if (video.processedVideoUrl === '') {
            logger.error(`Video ${ video.id } should not have an empty url`)
            return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
        }
        return NextResponse.json({ video: video }, { status: 200 })
    } catch (err) {
        logger.error(err)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
