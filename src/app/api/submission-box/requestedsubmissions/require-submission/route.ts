import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import logger from '@/utils/logger'
import prisma from '@/lib/prisma'

export async function GET() {
    // This API will return the count of requested submissions that the user has not yet submitted to, call with GET
    try {
        // Check if a user is logged in
        const session = await getServerSession()
        if (!session || !session.user?.email) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }
        // Get userId
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
        // This query returns the count of requested submissions with a videoVersions of none
        const requiredCount = await prisma.requestedSubmission.aggregate({
            where: {
                userId: userId,
                videoVersions: { none: {} },
            },
            _count: {
                id: true,
            },
        })

        return NextResponse.json({ requiredCount: requiredCount._count.id }, { status: 200 })
    } catch (error) {
        logger.error(error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
