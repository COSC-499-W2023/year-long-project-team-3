import { NextRequest, NextResponse } from 'next/server'
import logger from '@/utils/logger'
import { getServerSession } from 'next-auth'
import prisma from '@/lib/prisma'

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
        const id = (
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
        const requestedSubmissions = await prisma.submissionBox.findMany({
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

        const requestedSubmissionUsers: string[] = requestedSubmissions
            .flat()
            .map(({ requestedSubmissions }) => requestedSubmissions.map(({ userId }) => userId ?? ''))
            .flat()

        // If it is a user that has submitted to the box that is accessing the box
        if (requestedSubmissionUsers.includes(id)) {

            const requestedSubmission = await prisma.submissionBox.findFirstOrThrow({
                where: {
                    id: submissionBoxId,
                },
                select: {
                    requestedSubmissions: {
                        where: {
                            userId: id,
                        },
                        select: {
                            id: true,
                        },
                    },
                },
            })

            const requestedSubmissionId = requestedSubmission.requestedSubmissions.flat().map(({ id }) => id).flat()

            // Grab the video ids of all submissions
            const videoId = await prisma.submittedVideo.findFirst({
                where: {
                    requestedSubmissionId: {
                        in: [...requestedSubmissionId],
                    },
                },
                select: {
                    videoId: true,
                },
            })

            if (videoId === null) {
                return NextResponse.json({ box: 'Requested', videos: null, submissionBoxInfo: submissionBox }, { status: 200 })
            }
            // Get the videos themselves
            const boxVideo = await prisma.video.findUnique({
                where: {
                    id: videoId.videoId,
                },
            })

            return NextResponse.json({ box: 'Requested', videos: boxVideo, submissionBoxInfo: submissionBox }, { status: 200 })
        } else {
            // Else if it is the supposed owner accessing the submission box
            // Grab the managed submission box that the user wants to view
            const ownedSubmissionBox = await prisma.submissionBoxManager.findUniqueOrThrow({
                where: {
                    // eslint-disable-next-line camelcase
                    userId_submissionBoxId: {
                        userId: id,
                        submissionBoxId: submissionBoxId,
                    },
                },
                select: {
                    viewPermission: true,
                },
            })

            // Check if user is an owner of the managed submission box
            if (ownedSubmissionBox.viewPermission !== 'owner') {
                logger.error(`User ${ id } does not have permission to access submission box ${ submissionBoxId }`)
                return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
            }

            const requestedSubmissionIds: string[] = requestedSubmissions
                .flat()
                .map(({ requestedSubmissions }) => requestedSubmissions.map(({ id }) => id))
                .flat()

            // Grab the video ids of all submissions
            const requestedBoxVideosIds = await prisma.submittedVideo.findMany({
                where: {
                    requestedSubmissionId: {
                        in: [...requestedSubmissionIds],
                    },
                },
                select: {
                    videoId: true,
                },
            })

            const boxVideosIds = requestedBoxVideosIds
                .flat()
                .map(({ videoId }) => videoId)
                .flat()

            // Get the videos themselves
            const boxVideos = await prisma.video.findMany({
                where: {
                    id: {
                        in: [...boxVideosIds],
                    },
                },
            })

            return NextResponse.json({ box: 'Owned', videos: boxVideos, submissionBoxInfo: submissionBox }, { status: 200 })
        }
    } catch (err) {
        logger.error(err)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
