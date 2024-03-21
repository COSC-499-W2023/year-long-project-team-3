import { NextRequest, NextResponse } from 'next/server'
import logger from '@/utils/logger'
import { ResetPasswordAPIData } from '@/types/auth/user'
import prisma from '@/lib/prisma'
import { isDateWithinFifteenMinutes } from '@/utils/verification'
import { hash } from 'bcrypt'

export async function POST(req: NextRequest){
    try {
        const body: ResetPasswordAPIData = await req.json()
        const { token, password, passwordConfirmation } = body
        if (password !== passwordConfirmation) {
            return NextResponse.json({ error: 'Passwords do not match' }, { status: 400 })
        }

        const resetPasswordToken = await prisma.resetPasswordToken.findUnique({
            where: {
                token: token,
            },
        })
        if (!resetPasswordToken) {
            logger.error('Invalid password reset token')
            return NextResponse.json({ error: 'Invalid password reset token' }, { status: 400 })
        } else if (!isDateWithinFifteenMinutes(resetPasswordToken.updatedAt)) {
            return NextResponse.json({ error: 'Password reset link expired' }, { status: 410 })
        }

        // Update user password
        const hashedPassword = await hash(password, 10)
        await prisma.user.update({
            where: {
                id: resetPasswordToken.userId,
            },
            data: {
                password: hashedPassword,
            },
        })

        // Remove verification token
        await prisma.resetPasswordToken.delete({
            where: {
                id: resetPasswordToken.id,
            },
        })

        return NextResponse.json({ message: 'Password has been reset' }, { status: 201 })
    } catch (e) {
        logger.error('Password reset had an unexpected error')
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
