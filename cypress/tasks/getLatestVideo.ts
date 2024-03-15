import { Video } from '@prisma/client'
import prisma from '@/lib/prisma'

export default async function getLatestVideo(): Promise<Video> {
    const video = await prisma.video.findFirst({
        orderBy: {
            createdAt: 'desc',
        },
    })
    if (video === null) {
        throw Error('Prisma found no video and it should have')
    }
    return video
}
