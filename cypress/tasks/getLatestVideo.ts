import { Video } from '@prisma/client'

export default async function getLatestVideo(): Promise<Video> {
    return await prisma.video.findFirst({
        orderBy: {
            createdAt: 'desc',
        },
    })
}
