import prisma from '@/lib/prisma'
import { v4 as uuidv4 } from 'uuid'
import process from 'process'
import { sendEmail } from '@/utils/emails/sendEmail'
import logger from '@/utils/logger'
import { Message } from '@aws-sdk/client-ses'
import getTemplateMessage from '@/utils/emails/template'

export async function sendEmailResetPasswordEmail(email: string): Promise<boolean> {
    const user = await prisma.user.findUniqueOrThrow({
        where: {
            email,
        },
        select: {
            id: true,
            email: true,
        },
    })

    // Keep trying to generate token in case we generate one that isn't unique
    for (let i = 0; i < 10; i++) {
        try {
            const verificationToken = await prisma.resetPasswordToken.upsert({
                where: {
                    userId: user.id,
                },
                create: {
                    userId: user.id,
                    token: uuidv4(),
                },
                update: {
                    token: uuidv4(),
                },
            })
            const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? 'https://harpvideo.ca'
            let message = getResetPasswordMessage(baseUrl + '/reset-password/' + verificationToken.token)
            const res = await sendEmail(email, message)
            return res.$metadata.httpStatusCode === 200
        } catch (e) {
            logger.error('Failed to generate unique token for database: ' + e)
        }
    }
    return false
}

function getResetPasswordMessage(link: string): Message {
    return getTemplateMessage(
        'Password Reset - Harp Video',
        'THANKS FOR USING OUR SERVICE',
        'Reset Your Password',
        'Please click the button below to reset your password. If you did not request this email, you can ignore it or let us know at help@harpvideo.ca',
        'RESET PASSWORD',
        link,
    )
}
