import { Video } from '@prisma/client'

export async function makeS3Key(video: Video, fileEnding: string): Promise<string> {
    if (!video.ownerId) {
        // TODO: Remove this when adding anonymized feature
        throw new Error(`Missing ownerId in video ${ video.id }`)
    }

    try {
        /*
        We need to remove spaces in the video title because otherwise the transferBlurredVideosToStreamingPipeline
        lambda will get the following exception: botocore.exceptions.ClientError: An error occurred (AccessDenied) when
        calling the CopyObject operation: Access Denied.
        Also, we are replacing underscores with dashes because we are getting the ownerId and id from the key in the lambda
        using regex. Technically, having underscores in the video title is handled there, so this is just to be safe.
        */
        const videoTitle = video.title.replace(/\s/g, '').replace(/_/g, '-')
        return `${ videoTitle }_${ video.ownerId }_${ video.id }.${ fileEnding }`
    } catch (error) {
        throw new Error(`Unexpected error while fetching owner of video ${ video.id }`)
    }
}
