import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import prisma from '@/lib/prisma'
import logger from '@/utils/logger'

export async function GET(req: NextRequest) {
    try {
        const session = await getServerSession()
        if (!session || !session.user?.email) {
            return NextResponse.json({ error: 'You must be signed in to upload a video' }, { status: 401 })
        }

        const verificationToken = req.nextUrl.pathname.split('/').pop()
        if (!verificationToken) {
            return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
        }

        const a = await prisma.requestedEmailVerification.findUniqueOrThrow({
            where: {
                token: verificationToken,
            },
        })

        if (a.id) {
            logger.info('Token: ' + a.id)
        } else {
            return NextResponse.json({ error: 'Bad Request' }, { status: 400 })
        }
        return NextResponse.json({ message: 'User email verified' }, { status: 200 })
    } catch (e) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
