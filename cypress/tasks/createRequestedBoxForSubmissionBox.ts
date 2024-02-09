import prisma from '@/lib/prisma'

type CreateSubmissionBoxWithEmail = {
  submissionBoxId: string
  userId: string
  email?: string
}

export default async function createRequestedBoxForSubmissionBox(props: CreateSubmissionBoxWithEmail) {
    const requestedSubmission = await prisma.requestedSubmission.create({
        data: {
            email: props.email ?? '',
            userId: props.userId,
            submissionBoxId: props.submissionBoxId,
        },
    })

    return requestedSubmission.id
}
