import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import prisma from '@/lib/prisma'
import logger from '@/utils/logger'

export async function GET(req: NextRequest): Promise<NextResponse> {
    const session = await getServerSession()

    if (!session || !session.user?.email) {
        return NextResponse.json({ error: 'You must be signed in to upload a video' }, { status: 401 })
    }

    try {
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

        const submittedVideos = await prisma.submittedVideo.findMany({
            where: {
                videoId: videoId,
            },
        })

        const requestedSubmissionIds = submittedVideos.map(({ requestedSubmissionId }) => requestedSubmissionId)

        const submissionBoxes = await prisma.submissionBox.findMany({
            where: {
                requestedSubmissions: {
                    some: {
                        id: {
                            in: [...requestedSubmissionIds],
                        },
                    },
                },
            },
        })

        return NextResponse.json({ submissionBoxes }, { status: 200 })
    } catch (err) {
        logger.error(err)
        return NextResponse.json({ error: 'An unexpected error occurred' }, { status: 500 })
    }
}
