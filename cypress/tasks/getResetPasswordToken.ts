import prisma from '@/lib/prisma'

export default async function getResetPasswordToken(userEmail: string): Promise<string> {
    return (
        await prisma.resetPasswordToken.findUniqueOrThrow({
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
