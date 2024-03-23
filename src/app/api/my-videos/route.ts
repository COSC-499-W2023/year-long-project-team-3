import { NextResponse } from 'next/server'
import logger from '@/utils/logger'
import { getServerSession } from 'next-auth'
import prisma from '@/lib/prisma'
import { Video } from '@prisma/client'

/**
 * Retrieves all videos owned by the logged-in user as a (Video & VideoSubmission)[]
 */

export type VideoSubmission = {
    submissions: {
        requestedSubmission: {
            submissionBox: {
                id: string,
                title: string;
            }
        }
    }[]
}

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

        const myVideoSubmission: (Video & VideoSubmission)[] = (await prisma.video.findMany({
            where: {
                ownerId: userId,
            },
            include: {
                submissions: {
                    include: {
                        requestedSubmission: {
                            include: {
                                submissionBox: {
                                    select: {
                                        id: true,
                                        title: true,
                                    },
                                },
                            },
                        },
                    },
                },
            },
        }))

        return NextResponse.json({ videoSubmission: myVideoSubmission }, { status: 200 })
    } catch (err) {
        logger.error(err)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
