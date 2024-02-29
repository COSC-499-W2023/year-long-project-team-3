import prisma from '@/lib/prisma'

type SubmitVideoToSubmissionBoxParams = {
    videoId: string
    requestedSubmissionId: string
}

export default async function submitVideoToSubmissionBox(props: SubmitVideoToSubmissionBoxParams) {
    const { videoId, requestedSubmissionId } = props

    const video = await prisma.video.update({
        where: {
            id: videoId,
        },
        data: {
            submissions: {
                create: {
                    requestedSubmissionId: requestedSubmissionId,
                },
            },
            isSubmitted: true,
        },
    })

    // Add owner of box as allowed to view the video
    const requestedSubmission = await prisma.requestedSubmission.findUniqueOrThrow({
        where: {
            id: requestedSubmissionId,
        },
    })

    const owners = await prisma.submissionBoxManager.findMany({
        where: {
            submissionBoxId: requestedSubmission.submissionBoxId,
        },
        select: {
            userId: true,
        },
    })

    const videoWhitelist = await prisma.videoWhitelist.findUniqueOrThrow({
        where: {
            videoId,
        },
    })

    for (const owner of owners) {
        await prisma.videoWhitelistedUser.create({
            data: {
                whitelistedUserId: owner.userId,
                whitelistedVideoId: videoWhitelist.id,
            },
        })
    }

    return video.id
}
