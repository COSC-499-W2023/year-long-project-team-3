import prisma from '@/lib/prisma'

export default async function getVerificationToken(userEmail: string): Promise<string> {
    return (
        await prisma.requestedEmailVerification.findUniqueOrThrow({
            where: {
                userId: (await prisma.user.findUniqueOrThrow({
                    where: { email: userEmail },
                    select: { id: true },
                })).id,
            },
            select: { token: true },
        })
    ).token
}
