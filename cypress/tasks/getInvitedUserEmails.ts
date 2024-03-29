import prisma from '@/lib/prisma'

export async function getInvitedUserEmails(submissionBoxId: string): Promise<string[]> {
    return (
        await prisma.requestedSubmission.findMany({
            where: {
                submissionBoxId,
            },
            select: {
                email: true,
            },
        })
    ).map(requestedSubmission => requestedSubmission.email)
}
