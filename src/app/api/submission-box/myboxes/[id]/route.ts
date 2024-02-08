import { NextRequest, NextResponse } from 'next/server'
import logger from '@/utils/logger'
import { getServerSession } from 'next-auth'
import prisma from '@/lib/prisma'
import { Video } from '@prisma/client'

export type SubmissionBoxVideoViewPermission = 'owner' | 'submitter'

export async function GET(req: NextRequest): Promise<NextResponse> {
    // API fetches all the videos sent to a specific submission box and fetches the title, date, and description of the submission box
    const session = await getServerSession()
    if (!session || !session.user?.email) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const submissionBoxId = req.nextUrl.pathname.split('/').pop()
    if (!submissionBoxId) {
        return NextResponse.json({ error: 'No submissionBoxId provided' }, { status: 400 })
    }

    try {
        // Get user id
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

        let submissionBoxVideoPermission: SubmissionBoxVideoViewPermission = 'submitter'

        // Grab the managed submission box that the user wants to view
        const ownedSubmissionBox = await prisma.submissionBoxManager.findUnique({
            where: {
                // eslint-disable-next-line camelcase
                userId_submissionBoxId: {
                    userId: userId,
                    submissionBoxId: submissionBoxId,
                },
            },
            select: {
                viewPermission: true,
            },
        })

        const requestedSubmission = await prisma.requestedSubmission.findMany({
            where: {
                userId: userId,
                submissionBox: {
                    id: submissionBoxId,
                },
            },
        })

        // Check if user is an owner of the managed submission box
        if (!!ownedSubmissionBox && ownedSubmissionBox.viewPermission !== 'owner') {
            if (requestedSubmission.length === 0) {
                logger.error(`User ${ userId } does not have permission to access submission box ${ submissionBoxId }`)
                return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
            }
        }

        if (!!ownedSubmissionBox && ownedSubmissionBox.viewPermission === 'owner') {
            submissionBoxVideoPermission = 'owner'
        }

        // Get the submission box itself
        const submissionBox = await prisma.submissionBox.findUniqueOrThrow({
            where: {
                id: submissionBoxId,
            },
        })

        // Grab all submissions to the submission box
        const requestedSubmissions = await prisma.requestedSubmission.findMany({
            where: {
                submissionBoxId: submissionBoxId,
                userId: submissionBoxVideoPermission === 'owner' ? undefined : userId,
            },
            select: {
                id: true,
            },
        })
        const requestedSubmissionIds = requestedSubmissions.map(({ id }) => id)

        // Grab the video ids of all submissions
        const requestedBoxVideosIds = await prisma.submittedVideo.findMany({
            where: {
                requestedSubmissionId: {
                    in: [...requestedSubmissionIds],
                },
            },
            select: {
                video: true,
            },
        })

        const boxVideos: Video[] = requestedBoxVideosIds.map(({ video }) => video)

        return NextResponse.json({ videos: boxVideos, submissionBoxInfo: submissionBox }, { status: 200 })
    } catch (err) {
        logger.error(err)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
