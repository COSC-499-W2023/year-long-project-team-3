import prisma from '@/lib/prisma'

export default async function getRequestedSubmissions(email: string | undefined) {
    return prisma.requestedSubmission.findMany({
        where: {
            email,
        },
    })
}
