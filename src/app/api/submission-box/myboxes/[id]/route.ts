import { NextRequest, NextResponse } from 'next/server'
import logger from '@/utils/logger'
import { getServerSession } from 'next-auth'
import prisma from '@/lib/prisma'

export async function GET(req: NextRequest): Promise<NextResponse> {
    try {
        const session = await getServerSession()
        if (!session || !session.user?.email) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const submissionBoxId = req.nextUrl.pathname.split('/').pop()
        if (!submissionBoxId) {
            return NextResponse.json({ error: 'No submissionBoxId provided' }, {status: 500 })
        }

        const userId = (
            await prisma.user.findUniqueOrThrow({
                where: {
                    email: session.user.email,
                },
                select: {
                    id: true,
                },
            })
        ).id

        const ownedSubmissionBox = await prisma.submissionBoxManager.findMany({
            where: {
                userId: userId,
                submissionBoxId: submissionBoxId,
            },
        })

        if (!ownedSubmissionBox) {
            logger.error(`User ${ userId } does not have permission to access submission box ${ submissionBoxId }`)
            return NextResponse.json({ error: 'Forbidden' }, {status: 403 })
        }

        const requestedBoxVideosIds = await prisma.submittedVideo.findMany({
            where: {
                requestedSubmissionId: submissionBoxId,
            },
            select: {
                videoId: true,
            },
        })

        const boxVideosIds = requestedBoxVideosIds.flat().map(({videoId}) => videoId)

        const boxVideos = await Promise.all(
            boxVideosIds.map((videoId) => prisma.video.findUniqueOrThrow({where: {id: videoId } }))
        )

        return NextResponse.json({ videos: boxVideos }, {status: 200 })
    } catch (err) {
        logger.error(err)
        return NextResponse.json({ error: 'Internal Server Error' }, {status: 500 })
    }
}