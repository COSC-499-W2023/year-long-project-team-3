import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import logger from '@/utils/logger'
import prisma from '@/lib/prisma'

export async function GET() {
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

        const requiredCount = await prisma.requestedSubmission.aggregate({
            where: {
                userId: userId,
                videoVersions: { none: {} },
            },
            _count: {
                id: true,
            },
        })


        return NextResponse.json({ requiredCount: requiredCount }, { status: 200 })
    } catch (error) {
        logger.error(error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
