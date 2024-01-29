import prisma from '@/lib/prisma'

export default async function verifyEmail(email: string) {
    return prisma.user.update({
        where: {
            email,
        },
        data: {
            emailVerified: new Date(),
        },
    })
}
