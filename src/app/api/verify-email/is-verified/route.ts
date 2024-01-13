import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import prisma from '@/lib/prisma'

/**
 * Is the currently logged-in user's email verified?
 *
 * @return `{ isVerified: boolean }`
 */
export async function GET(req: NextRequest) {
    try {
        const session = await getServerSession()
        if (!session || !session.user?.email) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const user = await prisma.user.findUniqueOrThrow({
            where: {
                email: session.user.email,
            },
            select: {
                emailVerified: true,
            },
        })
        return NextResponse.json({ isVerified: !!user.emailVerified }, { status: 200 })
    } catch (e) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
