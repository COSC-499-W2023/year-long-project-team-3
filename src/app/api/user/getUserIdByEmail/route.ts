import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import prisma from '@/lib/prisma'
import logger from '@/utils/logger'

export async function POST(req: NextRequest): Promise<NextResponse> {
    const session = await getServerSession()

    if (!session || !session.user?.email) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { userEmail } = await req.json()

    if (!userEmail) {
        logger.error(`User ${ session.user.email } tried to get the user id of ${ userEmail }`)
        return NextResponse.json({ error: 'Bad Request' }, { status: 400 })
    }

    if (userEmail !== session.user.email) {
        logger.error(`User ${ session.user.email } tried to get the user id of ${ userEmail }`)
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    try {
        const userId = (
            await prisma.user.findUniqueOrThrow({
                where: {
                    email: userEmail,
                },
                select: {
                    id: true,
                },
            })
        ).id

        return NextResponse.json({ userId }, { status: 200 })
    } catch (err) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
