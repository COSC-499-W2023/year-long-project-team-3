import { type NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import logger from '@/utils/logger'
import prisma from '@/lib/prisma'
import { SubmissionBox } from '@prisma/client'

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

        const submissionBoxIds = await prisma.requestedSubmission.findMany({
            where: {
                userId: userId,
            },
            select: {
                submissionBoxId: true,
            },
        })

        const submissionBoxPromises: Promise<SubmissionBox>[] = submissionBoxIds.map(({ submissionBoxId }) =>
            prisma.submissionBox.findUniqueOrThrow({
                where: {
                    id: submissionBoxId,
                },
                include: {
                    requestedSubmissions: {
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
        )

        const submissionBoxes: SubmissionBox[] = await Promise.all(submissionBoxPromises)

        return NextResponse.json({ submissionBoxes: submissionBoxes }, { status: 200 })
    } catch (error) {
        logger.error(error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
