import prisma from '@/lib/prisma'

type CreateSubmissionBoxWithEmail = {
    email?: string
    userId?: string
}

export default async function createSubmissionBoxWithEmail(props: CreateSubmissionBoxWithEmail) {
    const newSubBox = await prisma.submissionBox.create({
        data: {
            title: 'test',
        },
    })

    const requestedSubmission = await prisma.requestedSubmission.create({
        data: {
            submissionBoxId: newSubBox.id,
            email: props.email || '',
            userId: props.userId || '',
        },
    })

    return requestedSubmission.id
}
