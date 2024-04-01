import prisma from '@/lib/prisma'

export async function inviteEmails(args: { submissionBoxId: string; emails: string[] }) {
    return prisma.requestedSubmission.createMany({
        data: args.emails.map(email => ({
            email,
            submissionBoxId: args.submissionBoxId,
        })),
    })
}
