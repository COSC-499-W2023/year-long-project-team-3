import prisma from '@/lib/prisma'

export default async function getRequestedSubmissions() {
    return await prisma.requestedSubmission.findMany()
}
