import {NextRequest, NextResponse} from 'next/server'
import logger from '@/utils/logger'
import {getServerSession} from 'next-auth'
import prisma from '@/lib/prisma'

/**
 * Submits a video to the specified submission boxes. \
 * Request format: { videoId: string, submissionBoxIds: string[] } \
 */
export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession()

        // Check that user is allowed authenticated
        if (!session || !session.user?.email) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }
        const sessionEmail = session.user.email

        const { videoId, submissionBoxIds } = await req.json()

        // Check data validity
        if (!videoId || typeof videoId !== 'string') {
            logger.error('Malformed request in api/video/submit: ' + JSON.stringify(req.body))
            return NextResponse.json({ error: 'Missing/malformed videoId' }, { status: 400 })
        } else if (typeof submissionBoxIds !== 'object' || !Array.isArray(submissionBoxIds)) {
            logger.error('Malformed request in api/video/submit: ' + JSON.stringify(req.body))
            return NextResponse.json({ error: 'Missing/malformed submissionBoxIds' }, { status: 400 })
        } else if (submissionBoxIds.some((submissionBoxId: any) => typeof submissionBoxId !== 'string')) {
            logger.error('Malformed request in api/video/submit: ' + JSON.stringify(req.body))
            return NextResponse.json({ error: 'Malformed submissionBoxIds' }, { status: 400 })
        }

        // Check that the user owns the video
        const video = await prisma.video.findUnique({
            where: {
                id: videoId,
            },
            select: {
                owner: {
                    select: {
                        email: true,
                    },
                },
            },
        })
        if (!video) {
            logger.error('Video not found in api/video/submit: ' + videoId)
            return NextResponse.json({ error: 'Video not found' }, { status: 404 })
        } else if (video.owner.email !== sessionEmail) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
        }

        // Check that all submission boxes exist and user is invited to them
        const requestedSubmissionIds = (await prisma.requestedSubmission.findMany({
            where: {
                submissionBoxId: {
                    in: submissionBoxIds,
                },
                email: sessionEmail,
            },
            select: {
                id: true,
            },
        })).map((rs) => rs.id)
        if (submissionBoxIds.length !== requestedSubmissionIds.length) {
            logger.error('Forbidden request in api/video/submit: ' + JSON.stringify(req.body))
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
        }

        // Check that none of the submission boxes have closed
        const closedSubmissionBoxes = await prisma.submissionBox.findMany({
            where: {
                id: {
                    in: submissionBoxIds,
                },
                closesAt: {
                    lte: new Date(),
                },
            },
            select: {
                id: true,
                title: true,
            },
        })
        if (closedSubmissionBoxes.length > 0) {
            logger.error('Forbidden request in api/video/submit: ' + JSON.stringify(req.body))
            return NextResponse.json({ error: 'Submission box must still be open to be valid to submit to' }, { status: 403 })
        }

        // Create whitelisted user for submission box owners and managers
        const { id: whitelistedVideoId } = await prisma.videoWhitelist.findUniqueOrThrow({
            where: {
                videoId: videoId,
            },
            select: {
                id: true,
            },
        })

        const submissionBoxOwnerIds = (await prisma.submissionBoxManager.findMany({
            where: {
                submissionBoxId: {
                    in: submissionBoxIds,
                },
            },
            select: {
                userId: true,
            },
        })).map(({ userId }) => userId)

        const whiteListedUserCreateData = submissionBoxOwnerIds.map((userId) => ({
            whitelistedUserId: userId,
            whitelistedVideoId: whitelistedVideoId,
        }))

        await prisma.videoWhitelistedUser.createMany({
            data: whiteListedUserCreateData,
            skipDuplicates: true,
        })

        // Create new SubmittedVideo if one doesn't already exist
        await prisma.submittedVideo.createMany({
            data: requestedSubmissionIds.map((id) =>  ({
                requestedSubmissionId: id,
                videoId: videoId,
            })),
            skipDuplicates: true,
        })

        return NextResponse.json({ message: 'Created' }, { status: 201 })
    } catch (err) {
        logger.error('Unexpected error while submitting in api/video/submit: ' + err)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}


/**
 * Unsubmits a video from the specified submission boxes.\
 * Request format: { videoId: string, submissionBoxIds: string[] }\
 */
export async function DELETE(req: NextRequest) {
    try {
        const session = await getServerSession()

        // Check that user is allowed authenticated
        if (!session || !session.user?.email) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }
        const sessionEmail = session.user.email

        const { videoId, submissionBoxIds } = await req.json()

        // Check data validity
        if (!videoId || typeof videoId !== 'string') {
            logger.error('Malformed request in api/video/submit: ' + JSON.stringify(req.body))
            return NextResponse.json({ error: 'Missing/malformed videoId' }, { status: 400 })
        } else if (typeof submissionBoxIds !== 'object' || !Array.isArray(submissionBoxIds)) {
            logger.error('Malformed request in api/video/submit: ' + JSON.stringify(req.body))
            return NextResponse.json({ error: 'Missing/malformed submissionBoxIds' }, { status: 400 })
        } else if (submissionBoxIds.some((submissionBoxId: any) => typeof submissionBoxId !== 'string')) {
            logger.error('Malformed request in api/video/submit: ' + JSON.stringify(req.body))
            return NextResponse.json({ error: 'Malformed submissionBoxIds' }, { status: 400 })
        }

        // Check that the user owns the video
        const video = await prisma.video.findUnique({
            where: {
                id: videoId,
            },
            select: {
                owner: {
                    select: {
                        email: true,
                    },
                },
            },
        })
        if (!video) {
            logger.error('Video not found in api/video/submit: ' + videoId)
            return NextResponse.json({ error: 'Video not found' }, { status: 404 })
        } else if (video.owner.email !== sessionEmail) {
            logger.error('Forbidden request in api/video/submit: ' + JSON.stringify(req.body))
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
        }

        // Check that all submission boxes exist and user is invited to them
        const requestedSubmissionIds = (await prisma.requestedSubmission.findMany({
            where: {
                submissionBoxId: {
                    in: submissionBoxIds,
                },
                email: sessionEmail,
            },
            select: {
                id: true,
            },
        })).map((rs) => rs.id)
        if (submissionBoxIds.length !== requestedSubmissionIds.length) {
            logger.error('Forbidden request in api/video/submit: ' + JSON.stringify(req.body))
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
        }

        // Get submission box managers and owners
        const requestedSubmissionManagers = (await prisma.submissionBoxManager.findMany({
            where: {
                submissionBoxId: {
                    in: submissionBoxIds,
                },
            },
            include: {
                user: {
                    select: {
                        id: true,
                    },
                },
            },
        })).map(({ user }) => user.id)

        // Find the submission box managers that still have permission
        const remainedRequestedSubmissionManagers = (await prisma.submissionBoxManager.findMany({
            where: {
                userId: {
                    in: requestedSubmissionManagers,
                },
                submissionBoxId: {},
            },
            select: {
                user: {
                    select: {
                        id: true,
                    },
                },
            },
        })).map(({ user }) => user.id)

        const whitelistedUserIdsToKeep = (await prisma.videoWhitelistedUser.findMany({
            where: {
                whitelistedUserId: {
                    in: remainedRequestedSubmissionManagers,
                },
                whitelistedVideo: {
                    videoId: videoId,
                },
            },
            select: {
                whitelistedUserId: true,
            },
        })).map(({ whitelistedUserId }) => whitelistedUserId)

        const userIdToRemove = remainedRequestedSubmissionManagers.filter((userId) => !whitelistedUserIdsToKeep.includes(userId))

        // Remove whitelisted users
        await prisma.videoWhitelistedUser.deleteMany({
            where: {
                whitelistedUserId: {
                    in: userIdToRemove,
                },
                whitelistedVideo: {
                    videoId: videoId,
                },
            },
        })

        // Delete any SubmittedVideos if they exist
        await prisma.submittedVideo.deleteMany({
            where: {
                videoId,
                requestedSubmissionId: {
                    in: requestedSubmissionIds,
                },
            },
        })

        return NextResponse.json({ message: 'Unsubmitted' }, { status: 200 })
    } catch (err) {
        logger.error('Unexpected error while submitting in api/video/submit: ' + err)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
