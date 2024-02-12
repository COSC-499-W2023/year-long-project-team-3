import prisma from '@/lib/prisma'
import { hash } from 'bcrypt'
export default async function loadManagedSubmissionBox() {
    const email = 'submission@in.box'
    const password = 'submissionIn1'
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
            title: 'Incoming Submission Box',
            description: null,
            closesAt: new Date('2050-12-01T03:24:00'),
            videoStoreToDate: null,
            maxVideoLength: null,
            isPublic: false,
        },
    })

    await prisma.submissionBoxManager.create({
        data: {
            userId: user.id,
            viewPermission: 'owner',
            submissionBoxId: submission.id,
        },
    })
    return null
}
