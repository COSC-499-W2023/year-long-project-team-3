import { NextRequest, NextResponse } from 'next/server'
import logger from '@/utils/logger'
import { getServerSession } from 'next-auth'
import prisma from '@/lib/prisma'

export async function GET(req: NextRequest): Promise<NextResponse> {
    // API fetches all the videos sent to a specific submission box and fetches the title, date, and description of the submission box
    // API has ability to fetch videos from either myBoxes or requestedBoxes
    const session = await getServerSession()
    if (!session || !session.user?.email) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    // Get submission box id
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

        // Get the submission box itself
        const submissionBox = await prisma.submissionBox.findUniqueOrThrow({
            where: {
                id: submissionBoxId,
            },
        })

        // Grab all submissions to the submission box
        const requestedSubmissions = await prisma.submissionBox.findUniqueOrThrow({
            where: {
                id: submissionBoxId,
            },
            select: {
                requestedSubmissions: {
                    select: {
                        id: true,
                        userId: true,
                    },
                },
            },
        })

        const requestedSubmissionUsers = requestedSubmissions.requestedSubmissions.map(({ userId }) => userId)

        // If it is a user that has submitted to the box that is accessing the box
        if (requestedSubmissionUsers && requestedSubmissionUsers.includes(userId)) {
            // Then this user is accessing the submission box via a requested page so only load their video on to the page
            const submission = await prisma.requestedSubmission.findFirst({
                where: {
                    userId: userId,
                    submissionBoxId: submissionBoxId,
                },
                select: {
                    videoVersions: {
                        orderBy: {
                            submittedAt: 'desc',
                        },
                        take: 1,
                    },
                },
            })

            // If the user hasn't submitted a video yet
            if (submission === null) {
                const boxStatus = 'requested'
                return NextResponse.json(
                    { box: boxStatus, videos: [], submissionBoxInfo: submissionBox },
                    { status: 200 }
                )
            }
            // Get the video itself
            const boxVideo = await prisma.video.findUnique({
                where: {
                    id: submission.videoVersions[0].videoId,
                },
            })

            const boxStatus = 'requested'
            return NextResponse.json(
                { box: boxStatus, videos: [boxVideo], submissionBoxInfo: submissionBox },
                { status: 200 }
            )
        } else {
            // Else if it is the supposed owner accessing the submission box
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

            // Check if user is an owner of the managed submission box
            if (ownedSubmissionBox && ownedSubmissionBox.viewPermission !== 'owner') {
                logger.error(`User ${ userId } does not have permission to access submission box ${ submissionBoxId }`)
                return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
            }

            const requestedSubmissionIds: string[] = requestedSubmissions.requestedSubmissions.map(({ id }) => id)

            // Grab the video ids of all submissions
            const requestedBoxVideosIds = await prisma.requestedSubmission.findMany({
                where: {
                    id: {
                        in: [...requestedSubmissionIds],
                    },
                },
                select: {
                    videoVersions: {
                        orderBy: {
                            submittedAt: 'desc',
                        },
                        take: 1,
                    },
                },
            })

            const boxVideosIds = requestedBoxVideosIds
                .map(({videoVersions}) => videoVersions[0].videoId)

            // Get the videos themselves
            const boxVideos = await prisma.video.findMany({
                where: {
                    id: {
                        in: [...boxVideosIds],
                    },
                },
            })
            const boxStatus = 'owned'
            return NextResponse.json(
                { box: boxStatus, videos: boxVideos, submissionBoxInfo: submissionBox },
                { status: 200 }
            )
        }
    } catch (err) {
        logger.error(err)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
