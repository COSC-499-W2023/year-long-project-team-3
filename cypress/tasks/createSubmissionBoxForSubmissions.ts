import prisma from '@/lib/prisma'

type CreateSubmissionBoxForSubmissions = {
    submissionBoxTitle?: string
    submissionBoxDescription?: string
    userId: string
    closesAt?: Date
}

export default async function createRequestedBoxForSubmissionBox(props: CreateSubmissionBoxForSubmissions) {
    const newSubBox = await prisma.submissionBox.create({
        data: {
            title: props.submissionBoxTitle ?? 'Test Submission Box',
            description: props.submissionBoxDescription ?? null,
            closesAt: props.closesAt ?? null,
        },
    })

    await prisma.submissionBoxManager.create({
        data: {
            submissionBoxId: newSubBox.id,
            userId: props.userId,
            viewPermission: 'owner',
        },
    })

    return newSubBox.id
}
