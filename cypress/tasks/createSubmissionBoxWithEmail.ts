import prisma from '@/lib/prisma'

export default async function createSubmissionBoxWithEmail(email: string) {
    const newSubBox = await prisma.submissionBox.create({
        data: {
            title: 'test',
        },
    })

    await prisma.requestedSubmission.create({
        data: {
            submissionBoxId: newSubBox.id,
            email: email,
        },
    })

    return null
}
