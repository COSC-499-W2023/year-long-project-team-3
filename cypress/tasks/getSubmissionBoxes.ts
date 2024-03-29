import prisma from '@/lib/prisma'

export default async function getSubmissionBoxes() {
    return prisma.submissionBox.findMany()
}
