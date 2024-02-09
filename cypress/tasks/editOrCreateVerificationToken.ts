import prisma from '@/lib/prisma'
import { v4 as uuidv4 } from 'uuid'

export async function editOrCreateVerificationToken(args: {
    email: string
    date: Date | undefined
}) {
    const { email, date} = args

    const user = await prisma.user.findUniqueOrThrow({
        where: {
            email,
        },
    })

    return prisma.requestedEmailVerification.upsert({
        where: {
            userId: user.id,
        },
        create: {
            userId: user.id,
            token: uuidv4(),
        },
        update: {
            updatedAt: date,
        },
    })
}
