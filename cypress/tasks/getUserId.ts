import prisma from '@/lib/prisma'

export default async function getUserId(userEmail: string): Promise<string> {
    return (
        await prisma.user.findUniqueOrThrow({
            where: {
                email: userEmail,
            },
            select: { id: true },
        })
    ).id
}
