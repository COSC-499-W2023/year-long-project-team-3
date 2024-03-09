import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import prisma from '@/lib/prisma'
import { isDateWithinLast24Hours } from '@/utils/verification'
import logger from '@/utils/logger'

/**
 * Handles a GET request to check if a user has an open verification token within the last 24 hours.
 * @returns On success returns { hasOpenToken: boolean }
 */
export async function GET(){
    try {
        const session = await getServerSession()
        if (!session || !session.user?.email) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const { emailVerified } = await prisma.user.findUniqueOrThrow({
            where: {
                email: session.user.email,
            },
            select: {
                emailVerified: true,
            },
        })

        const verificationTokens = await prisma.requestedEmailVerification.findMany({
            where: {
                user: {
                    email: session.user.email,
                },
            },
            select: {
                updatedAt: true,
            },
        })

        const hasOpenToken = verificationTokens.some((token) => isDateWithinLast24Hours(token.updatedAt))

        logger.info('User has open token: ' + hasOpenToken)

        return NextResponse.json({ hasOpenToken: hasOpenToken, isUserVerified: !!emailVerified }, { status: 200 })
    } catch (e) {
        logger.error('Error in verify-email/has-open-token: ' + e)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
