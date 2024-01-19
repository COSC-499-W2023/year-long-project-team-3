import { type NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import prisma from '@/lib/prisma'
import logger from '@/utils/logger'

export async function PUT(req: NextRequest): Promise<NextResponse> {
    const session = await getServerSession()
    if (!session || !session.user?.email) {
        return NextResponse.json({ error: 'You must be signed in to upload a video' }, { status: 401 })
    }

    const videoId = req.nextUrl.pathname.split('/').pop()
    if (!videoId) {
        return NextResponse.json({ error: 'No videoId provided' }, { status: 500 })
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

        const whitelistedUser = await prisma.videoWhitelistedUser.findUnique({
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

        const updatedVideo = await prisma.video.update({
            where: {
                id: videoId,
            },
            data: {
                title: title,
                description: description,
            },
        })

        return NextResponse.json({ video: updatedVideo }, { status: 200 })
    } catch (error) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
