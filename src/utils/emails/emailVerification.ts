import { sendEmail } from '@/utils/emails/sendEmail'
import { Message } from '@aws-sdk/client-ses'
import * as process from 'process'
import prisma from '@/lib/prisma'
import { v4 as uuidv4 } from 'uuid'
import logger from '@/utils/logger'
import getTemplateMessage from '@/utils/emails/template'

export async function sendEmailVerificationEmail(email: string): Promise<boolean> {
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
            const verificationToken = await prisma.requestedEmailVerification.upsert({
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
            let message = getVerificationMessage(baseUrl + '/verify-email/' + verificationToken.token)
            const res = await sendEmail(email, message)
            return res.$metadata.httpStatusCode === 200
        } catch (e) {
            logger.error('Failed to generate unique token for database: ' + e)
        }
    }
    return false
}

function getVerificationMessage(link: string): Message {
    return getTemplateMessage(
        'Verify your email - Harp Video',
        'THANKS FOR SIGNING UP!',
        'Verify Your E-Mail Address',
        'You\'re almost ready to get started. Please click on the button below to verify your email address and start sending videos!',
        'VERIFY YOUR EMAIL',
        link,
    )
}
