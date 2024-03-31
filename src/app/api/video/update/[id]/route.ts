import { type NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import prisma from '@/lib/prisma'
import logger from '@/utils/logger'
import { getWhitelistedUser } from '@/utils/videos'

export async function PUT(req: NextRequest): Promise<NextResponse> {
    const session = await getServerSession()
    if (!session || !session.user?.email) {
        return NextResponse.json({ error: 'You must be signed in to edit the video' }, { status: 401 })
    }

    const videoId = req.nextUrl.pathname.split('/').pop()
    if (!videoId) {
        return NextResponse.json({ error: 'No videoId provided' }, { status: 400 })
    }

    const { title, description } = await req.json()
    if (!title || typeof title !== 'string') {
        logger.error(`User ${ session.user.email } did not provide a title`)
        return NextResponse.json({ error: 'No title provided' }, { status: 500 })
    }
    if (typeof description !== 'string') {
        logger.error('Unexpected description type')
        return NextResponse.json({ error: 'Unexpected description type' }, { status: 500 })
    }

    try {
        if (!(await getWhitelistedUser(session.user.email, videoId))) {
            logger.error(`User ${ session.user.email } does not have permission to access video ${ videoId }`)
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
        }

        const updatedVideo = await prisma.video.update({
            where: {
                id: videoId,
                owner: {
                    email: session.user.email,
                },
                isCloudProcessed: true,
            },
            data: {
                title: title,
                description: description,
            },
        })

        if (!updatedVideo) {
            logger.error('Unable to update video information when video has not finished processing')
            return NextResponse.json({ error: 'Unable to update videos that are currently being processed' }, { status: 500 })
        }

        return NextResponse.json({ video: updatedVideo }, { status: 200 })
    } catch (error) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
