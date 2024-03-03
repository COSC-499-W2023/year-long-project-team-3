import prisma from '@/lib/prisma'

type CreateRequestedBoxForSubmissionBox = {
  submissionBoxId: string
  userId: string
  email?: string
}

export default async function createRequestedBoxForSubmissionBox(props: CreateRequestedBoxForSubmissionBox) {
    const user = await prisma.user.findUniqueOrThrow({
        where: {
            id: props.userId,
        },
    })

    const requestedSubmission = await prisma.requestedSubmission.findFirst({
        where: {
            email: user.email,
            userId: props.userId,
            submissionBoxId: props.submissionBoxId,
        },
    })

    if (requestedSubmission) {
        return requestedSubmission.id
    }

    // If requestedSubmission does not exist, create a new one
    const newRequestedSubmission = await prisma.requestedSubmission.create({
        data: {
            email: user.email,
            userId: props.userId,
            submissionBoxId: props.submissionBoxId,
        },
    })
    return newRequestedSubmission.id
}
