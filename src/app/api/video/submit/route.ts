import { type NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import logger from '@/utils/logger'
import prisma from '@/lib/prisma'
import { RequestedSubmission, Video } from '@prisma/client'

export async function POST(req: NextRequest): Promise<NextResponse> {
    const session = await getServerSession()
    if (!session || !session.user?.email) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { videoId, videoTitle, videoDescription, submissionBoxIds } = await req.json()

    if (!videoId || typeof videoId !== 'string') {
        logger.error(`User ${ session.user.email } did not provide a videoId`)
        return NextResponse.json({ error: 'No videoId provided' }, { status: 400 })
    }

    if (!videoTitle || typeof videoTitle !== 'string') {
        logger.error(`User ${ session.user.email } did not provide a videoTitle`)
        return NextResponse.json({ error: 'No videoTitle provided' }, { status: 500 })
    }

    if (!!videoDescription && typeof videoDescription !== 'string') {
        logger.error('Unexpected videoDescription type')
        return NextResponse.json({ error: 'Unexpected videoDescription type' }, { status: 500 })
    }

    submissionBoxIds.forEach((submissionBoxId: any) => {
        if (typeof submissionBoxId !== 'string') {
            logger.error('Unexpected submissionBoxId type')
            return NextResponse.json({ error: 'Unexpected submissionBoxId type' }, { status: 500 })
        }
    })

    try {
        const user = await prisma.user.findUniqueOrThrow({
            where: {
                email: session.user.email,
            },
            select: {
                id: true,
            },
        })

        const whitelistedVideo = await prisma.videoWhitelist.findUniqueOrThrow({
            where: {
                videoId: videoId,
            },
        })

        const whitelistedUser = await prisma.videoWhitelistedUser.findUniqueOrThrow({
            where: {
                // eslint-disable-next-line camelcase
                whitelistedVideoId_whitelistedUserId: {
                    whitelistedUserId: user.id,
                    whitelistedVideoId: whitelistedVideo.id,
                },
            },
        })

        if (!whitelistedUser) {
            logger.error(`User ${ user.id } does not have permission to access video ${ videoId }`)
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
        }

        // Update the video with latest data
        const video: Video = await prisma.video.update({
            where: {
                id: videoId,
            },
            data: {
                title: videoTitle,
                description: videoDescription,
                isSubmitted: true,
            },
        })

        const updatedRequestedSubmissionPromises = submissionBoxIds.map(
            async (submissionBoxId: string): Promise<RequestedSubmission[]> => {
                const requestedSubmissions: RequestedSubmission[] = (
                    await prisma.requestedSubmission.findMany({
                        where: {
                            submissionBoxId: submissionBoxId,
                            userId: user.id,
                        },
                    })
                ).flat()

                return await Promise.all(
                    requestedSubmissions
                        .map(
                            (requestedSubmission: RequestedSubmission): Promise<RequestedSubmission> =>
                                prisma.requestedSubmission.update({
                                    where: {
                                        id: requestedSubmission.id,
                                    },
                                    data: {
                                        videoVersions: {
                                            create: {
                                                videoId: video.id,
                                                submittedAt: new Date(),
                                            },
                                        },
                                    },
                                })
                        )
                        .flat()
                )
            }
        )

        await Promise.all(updatedRequestedSubmissionPromises)

        return NextResponse.json({ message: `Successfully submitted ${ videoTitle }` }, { status: 201 })
    } catch (err) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
