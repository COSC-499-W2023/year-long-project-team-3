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
            return NextResponse.json({ error: 'Missing/malformed videoId' }, { status: 400 })
        } else if (typeof submissionBoxIds !== 'object' || !Array.isArray(submissionBoxIds)) {
            return NextResponse.json({ error: 'Missing/malformed submissionBoxIds' }, { status: 400 })
        } else if (submissionBoxIds.some((submissionBoxId: any) => typeof submissionBoxId !== 'string')) {
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
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
        }

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
            return NextResponse.json({ error: 'Missing/malformed videoId' }, { status: 400 })
        } else if (typeof submissionBoxIds !== 'object' || !Array.isArray(submissionBoxIds)) {
            return NextResponse.json({ error: 'Missing/malformed submissionBoxIds' }, { status: 400 })
        } else if (submissionBoxIds.some((submissionBoxId: any) => typeof submissionBoxId !== 'string')) {
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
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
        }

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
