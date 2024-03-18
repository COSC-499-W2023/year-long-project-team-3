import { type NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import logger from '@/utils/logger'
import prisma from '@/lib/prisma'
import { SubmissionBoxInfo } from '@/types/submission-box/submissionBoxInfo'

export async function GET(_: NextRequest): Promise<NextResponse> {
    try {
        const session = await getServerSession()
        if (!session || !session.user?.email) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const userId: string = (
            await prisma.user.findUniqueOrThrow({
                where: {
                    email: session.user.email,
                },
                select: {
                    id: true,
                },
            })
        ).id

        const submissionBoxIds = (
            await prisma.submissionBoxManager.findMany({
                where: {
                    userId: userId,
                },
                select: {
                    submissionBoxId: true,
                },
            })
        ).map(({submissionBoxId}) => submissionBoxId)

        const submissionBoxes: SubmissionBoxInfo[] = await prisma.submissionBox.findMany({
            where: {
                id: {
                    in: submissionBoxIds,
                },
            },
            include: {
                requestedSubmissions: {
                    where: {
                        userId: userId,
                    },
                    include: {
                        videoVersions: {
                            select: {
                                submittedAt: true,
                            },
                        },
                    },
                },
            },
        })

        return NextResponse.json({ submissionBoxes: submissionBoxes }, { status: 200 })
    } catch (error) {
        logger.error(error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
