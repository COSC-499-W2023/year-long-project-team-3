import prisma from '@/lib/prisma'

export async function deleteVerificationToken(email: string) {
    const user = await prisma.user.findUniqueOrThrow({
        where: {
            email,
        },
    })

    return prisma.requestedEmailVerification.deleteMany({
        where: {
            userId: user.id,
        },
    })
}
