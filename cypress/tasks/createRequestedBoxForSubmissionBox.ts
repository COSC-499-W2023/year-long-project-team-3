import prisma from '@/lib/prisma'

type CreateRequestedBoxForSubmissionBox = {
  submissionBoxId: string
  userId?: string
  email: string
}

export default async function createRequestedBoxForSubmissionBox(props: CreateRequestedBoxForSubmissionBox) {
    const userEmail = props.email ?? (await prisma.user.findUniqueOrThrow({ where: { id: props.userId } })).email

    try {
        return (await prisma.requestedSubmission.create({
            data: {
                email: userEmail,
                userId: props.userId,
                submissionBoxId: props.submissionBoxId,
            },
        })).id
    } catch (e) {
        return (
            await prisma.requestedSubmission.findUniqueOrThrow({
                where: {
                    'email_submissionBoxId': {
                        submissionBoxId: props.submissionBoxId,
                        email: userEmail,
                    },
                },
            })
        ).id
    }
}
