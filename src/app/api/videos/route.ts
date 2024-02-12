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

        const allRequestedSubmissions = await prisma.requestedSubmission.findMany({
            where: {
                submissionBoxId: {
                    in: ownedSubmissionBoxIds.map(({ submissionBoxId }) => submissionBoxId),
                },
            },
            select: {
                id: true,
            },
        })

        const uniqueRequestedSubmissions = Array.from(new Set(allRequestedSubmissions.map(({ id }) => id)))

        const submittedVideos: Video[] = (await prisma.submittedVideo.findMany({
            where: {
                requestedSubmissionId: {
                    in: uniqueRequestedSubmissions,
                },
            },
            select: {
                video: true,
            },
        })).map(({ video }) => video)

        const videoIdSet = new Set<string>()
        const allVideos: Video[] = ownedVideos.concat(submittedVideos)
        const uniqueVideos: Video[] = allVideos.filter((video) => {
            if (videoIdSet.has(video.id)) {
                return false
            }
            videoIdSet.add(video.id)
            return true
        })

        return NextResponse.json({ videos: uniqueVideos }, { status: 200 })
    } catch (err) {
        logger.error(err)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
