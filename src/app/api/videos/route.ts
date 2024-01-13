import { NextResponse } from 'next/server'
import logger from '@/utils/logger'
import { getServerSession } from 'next-auth'
import prisma from '@/lib/prisma'
import { Video } from '@prisma/client'

export async function GET(): Promise<NextResponse> {
    try {
        const session = await getServerSession()
        if (!session || !session.user?.email) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
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

        const ownedVideos: Video[] = await prisma.video.findMany({
            where: {
                ownerId: userId,
                isSubmitted: true,
            },
        })

        const ownedSubmissionBoxIds = await prisma.submissionBoxManager.findMany({
            where: {
                userId: userId,
            },
            select: {
                submissionBoxId: true,
            },
        })

        const allRequestedSubmissions = await Promise.all(
            ownedSubmissionBoxIds.map(({ submissionBoxId }) => {
                return prisma.submissionBox.findMany({
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
            })
        )

        const allRequestedSubmissionIds: string[] = allRequestedSubmissions
            .flat()
            .map(({ requestedSubmissions }) => requestedSubmissions.map(({ id }) => id))
            .flat()

        const allSubmittedVideoToRequestedSubmissions = await Promise.all(
            allRequestedSubmissionIds.map((requestedSubmissionId) =>
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

        const allSubmittedVideoIds: string[] = allSubmittedVideoToRequestedSubmissions
            .flat()
            .map(({ videoId }) => videoId)

        const submittedVideos: Video[] = await Promise.all(
            allSubmittedVideoIds.map((videoId) => prisma.video.findUniqueOrThrow({ where: { id: videoId } }))
        )

        const allVideos: Video[] = ownedVideos.concat(submittedVideos)

        return NextResponse.json({ videos: allVideos }, { status: 200 })
    } catch (err) {
        logger.error(err)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
