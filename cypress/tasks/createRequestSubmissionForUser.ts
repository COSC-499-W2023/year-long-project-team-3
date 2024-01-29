import prisma from '@/lib/prisma'
import { v4 as uuidv4 } from 'uuid'

type CreateSubmissionBoxWithEmailData = {
    userId: string
    submissionBoxTitle?: string
}

export default async function createRequestSubmissionForUser(props: CreateSubmissionBoxWithEmailData): Promise<string> {
    const { userId } = props

    const fakeUser = await prisma.user.create({
        data: {
            email: 'user' + uuidv4() + '@example.com',
        },
    })

    const newSubBox = await prisma.submissionBox.create({
        data: {
            title: props.submissionBoxTitle ?? 'Test Submission Box ' + uuidv4(),
        },
    })

    await prisma.submissionBoxManager.create({
        data: {
            submissionBoxId: newSubBox.id,
            userId: fakeUser.id,
            viewPermission: 'owner',
        },
    })

    const requestedSubmission = await prisma.requestedSubmission.create({
        data: {
            email: '',
            userId: userId,
            submissionBoxId: newSubBox.id,
        },
    })

    return requestedSubmission.id
}
