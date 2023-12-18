import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import prisma from '@/lib/prisma'

export async function POST(req: NextRequest): Promise<NextResponse> {
    const session = await getServerSession()

    if (!session || !session.user?.email) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { userEmail } = await req.json()

    if (!userEmail) {
        return NextResponse.json({ error: 'Bad Request' }, { status: 400 })
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
