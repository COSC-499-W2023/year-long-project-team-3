import prisma from '@/lib/prisma'
import { v4 as uuidv4 } from 'uuid'

export default async function createResetPasswordToken(email: string): Promise<string> {
    return(
        await prisma.resetPasswordToken.create({
            data: {
                token: uuidv4(),
                user: {
                    connect: { email: email },
                },
            },
        })
    ).token
}
