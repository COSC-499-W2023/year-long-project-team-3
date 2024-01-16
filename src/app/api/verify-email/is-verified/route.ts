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
                createdAt: true,
                accounts: {
                    select: {
                        provider: true,
                    },
                },
            },
        })

        if (!!user.emailVerified) {
            return NextResponse.json({ isVerified: true }, { status: 200 })
        } else if (user.accounts.some(account => account.provider === 'google')) {
            // Update user record to show that their email is verified if they log in with google
            await prisma.user.update({
                where: {
                    email: session.user.email,
                },
                data: {
                    emailVerified: user.createdAt,
                },
            })
            return NextResponse.json({ isVerified: true }, { status: 200 })
        } else {
            return NextResponse.json({ isVerified: false }, { status: 200 })
        }
    } catch (e) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
