import prisma from '@/lib/prisma'

export default async function getSubmissionBoxes() {
    return await prisma.submissionBox.findMany()
}
