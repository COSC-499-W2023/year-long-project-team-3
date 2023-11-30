import { Video } from '@prisma/client'

export async function makeS3Key(video: Video, fileEnding: string): Promise<string> {
    if (!video.ownerId) {
        // TODO: Remove this when adding anonymized feature
        throw new Error(`Missing ownerId in video ${ video.id }`)
    }

    try {
        return `${ video.title }_${ video.ownerId }_${ video.id }.${ fileEnding }`
    } catch (error) {
        throw new Error(`Unexpected error while fetching owner of video ${ video.id }`)
    }
}