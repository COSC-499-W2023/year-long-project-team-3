import { NextRequest, NextResponse } from 'next/server'
import logger from '@/utils/logger'
import { ResetPasswordEmailData } from '@/types/auth/user'
import { isValidEmail } from '@/utils/verification'
import { sendEmailResetPasswordEmail } from '@/utils/emails/resetPassword'
import prisma from '@/lib/prisma'

export async function POST(req: NextRequest) {
    try {
        const body: ResetPasswordEmailData = await req.json()
        const { email } = body
        if (!isValidEmail(email)) {
            return NextResponse.json({ error: 'Invalid email address' }, { status: 500 })
        }
        const user = await prisma.user.findFirst({
            where: {
                email,
            },
        })
        if (!user) {
            // This is still a success because we do not want to let the user know if that is actually an email or not.
            return NextResponse.json({ message: 'Request Success' }, { status: 201 })
        }
        const succeeded = await sendEmailResetPasswordEmail(email)
        if (succeeded) {
            return NextResponse.json({ message: 'Request Success' }, { status: 201 })
        } else {
            logger.error('Unknown error when sending reset password email')
            return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
        }
    } catch (e) {
        logger.error('Password reset had an unexpected error')
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
