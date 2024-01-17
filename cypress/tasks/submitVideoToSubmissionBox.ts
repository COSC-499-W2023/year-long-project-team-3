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

    return video.id
}
