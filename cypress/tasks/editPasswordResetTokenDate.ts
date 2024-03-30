import prisma from '@/lib/prisma'

export default async function editPasswordResetTokenDate(args: {token: string, date: Date}) {
    return prisma.resetPasswordToken.update({
        where: {
            token: args.token,
        },
        data: {
            updatedAt: args.date,
        },
    })
}
