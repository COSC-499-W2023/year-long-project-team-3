import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { sendEmailVerificationEmail } from '@/utils/emails/emailVerification'
import logger from '@/utils/logger'

export async function GET(req: NextRequest) {
    const session = await getServerSession()
    if (!session || !session.user?.email) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    try {
        const succeeded = await sendEmailVerificationEmail(session.user.email)
        if (succeeded) {
            return NextResponse.json({ message: 'Email sent' }, { status: 200 })
        } else {
            return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
        }
    } catch (e) {
        logger.error('Email verification had an unexpected error')
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
