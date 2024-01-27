import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import prisma from '@/lib/prisma'
import logger from '@/utils/logger'
import { getWhitelistedUser } from '@/utils/videos'

export async function GET(req: NextRequest): Promise<NextResponse> {
    const session = await getServerSession()

    if (!session || !session.user?.email) {
        return NextResponse.json({ error: 'You must be signed in to upload a video' }, { status: 401 })
    }

    try {
        const videoId = req.nextUrl.pathname.split('/').pop()
        if (!videoId) {
            return NextResponse.json({ error: 'No videoId provided' }, { status: 400 })
        }

        if (await getWhitelistedUser(session.user.email, videoId)) {
            logger.error(`User ${ session.user.email } does not have permission to access video ${ videoId }`)
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
