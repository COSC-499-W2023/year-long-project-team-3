import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import prisma from '@/lib/prisma'
import logger from '@/utils/logger'
import { isDateWithinLast24Hours } from '@/utils/verification'

export async function GET(req: NextRequest) {
    const session = await getServerSession()
    if (!session || !session.user?.email) {
        return NextResponse.json({ error: 'You must be signed in to upload a video' }, { status: 401 })
    }

    const verificationToken = req.nextUrl.pathname.split('/').pop()
    if (!verificationToken) {
        logger.error('Email verification API called with invalid path')
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }

    try {
        const requestedEmailVerification = await prisma.requestedEmailVerification.findUnique({
            where: {
                token: verificationToken,
            },
        })
        if (!requestedEmailVerification) {
            logger.error('User submitted an email validation token that was not in the database')
            return NextResponse.json({ error: 'Invalid verification link' }, { status: 400 })
        } else if (!isDateWithinLast24Hours(requestedEmailVerification.updatedAt)) {
            return NextResponse.json({ error: 'Verification link expired' }, { status: 400 })
        }

        // Set user's email as verified
        await prisma.user.update({
            where: {
                email: session.user.email,
            },
            data: {
                emailVerified: new Date(),
            },
        })

        // Remove verification token
        await prisma.requestedEmailVerification.delete({
            where: {
                id: requestedEmailVerification.id,
            },
        })

        return NextResponse.json({ message: 'User email verified' }, { status: 200 })
    } catch (e) {
        logger.error('Unknown error occurred while validating email: ' + e)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
