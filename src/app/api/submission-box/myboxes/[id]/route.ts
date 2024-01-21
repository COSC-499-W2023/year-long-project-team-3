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

        const submissionBox = await prisma.submissionBox.findUniqueOrThrow({
            where: {
                id: submissionBoxId,
            },
        })

        const requestedSubmissions = await prisma.submissionBox.findMany({
            where: {
                id: submissionBoxId,
            },
            select: {
                requestedSubmissions: {
                    select: {
                        id: true,
                    },
                },
            },
        })

        const requestedSubmissionIds: string[] = requestedSubmissions
            .flat()
            .map(({ requestedSubmissions }) => requestedSubmissions.map(({ id }) => id))
            .flat()

        const requestedBoxVideosIds = await Promise.all(
            requestedSubmissionIds.map((requestedSubmissionId) =>
                prisma.submittedVideo.findMany({
                    where: {
                        requestedSubmissionId: requestedSubmissionId,
                    },
                    select: {
                        videoId: true,
                    },
                })
            )
        )

        const boxVideosIds = requestedBoxVideosIds.flat().map(({videoId}) => videoId)

        const boxVideos = await Promise.all(
            boxVideosIds.map((videoId) => prisma.video.findUniqueOrThrow({where: {id: videoId } }))
        )

        return NextResponse.json({ videos: boxVideos, submissionBoxInfo: submissionBox }, {status: 200 })
    } catch (err) {
        logger.error(err)
        return NextResponse.json({ error: 'Internal Server Error' }, {status: 500 })
    }
}