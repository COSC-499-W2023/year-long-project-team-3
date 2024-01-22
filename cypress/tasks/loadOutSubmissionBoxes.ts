import prisma from '@/lib/prisma'
import { hash } from 'bcrypt'

type LoadInSubmissionBoxesProps = {
    email: string
    password: string
    title: string
}

export default async function loadInSubmissionBoxes(props: LoadInSubmissionBoxesProps) {
    const { email, password, title } = props
    const hashedPassword = await hash(password, 10)

    await prisma.user.create({
        data: {
            email,
            password: hashedPassword,
            emailVerified: new Date(),
            accounts: {
                create: {
                    type: 'bcrypt',
                    provider: 'credentials',
                    providerAccountId: email,
                },
            },
        },
        select: {
            id: true,
            email: true,
            createdAt: true,
            updatedAt: true,
        },
    })

    const user = await prisma.user.findUniqueOrThrow({
        where: {
            email: email,
        },
    })

    const submission = await prisma.submissionBox.create({
        data: {
            title: title,
            description: null,
            closesAt: new Date('2050-12-01T03:24:00'),
            videoStoreToDate: null,
            maxVideoLength: null,
            isPublic: false,
        },
    })

    await prisma.requestedSubmission.create({
        data: {
            email: email,
            userId: user.id,
            submissionBoxId: submission.id,
        },
    })
    return null
}
