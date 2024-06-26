import prisma from '@/lib/prisma'

type CreateSubmissionBoxWithEmail = {
    submissionBoxTitle?: string
    email?: string
    userId?: string
    submissionBoxDescription?: string
}

export default async function createSubmissionBoxWithEmail(props: CreateSubmissionBoxWithEmail) {
    const newSubBox = await prisma.submissionBox.create({
        data: {
            title: props.submissionBoxTitle ?? 'test',
            description: props.submissionBoxDescription ?? null,
        },
    })

    const requestedSubmission = await prisma.requestedSubmission.create({
        data: {
            submissionBoxId: newSubBox.id,
            email: props.email ?? '',
        },
    })

    if (!!props.userId) {
        await prisma.submissionBoxManager.create({
            data: {
                userId: props.userId,
                submissionBoxId: newSubBox.id,
                viewPermission: 'owner',
            },
        })
    }

    return requestedSubmission.id
}
