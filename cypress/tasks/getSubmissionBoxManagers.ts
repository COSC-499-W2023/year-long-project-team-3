import prisma from '@/lib/prisma'

export default async function getSubmissionBoxManagers() {
    return await prisma.submissionBoxManager.findMany()
}
