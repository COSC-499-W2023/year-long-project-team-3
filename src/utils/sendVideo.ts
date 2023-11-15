import { Video } from '@prisma/client'
import AWS, { Account } from 'aws-sdk'
import S3, { PutObjectRequest } from 'aws-sdk/clients/s3'
import logger from './logger'

async function makeS3Key(video: Video): Promise<string> {
    if (!video.ownerId) {
        // TODO: Remove this when adding anonymized feature
        throw new Error(`Missing ownerId in video ${ video.id }`)
    }

    try {
        return `${ video.title }_${ video.ownerId }_${ video.id }.mp4`
    } catch (error) {
        logger.error(error)
        throw new Error(`Unexpected error while fetching owner of video ${ video.id }`)
    }
}

export default async function sendVideo(rawVideo: File) {
    // const key = await makeS3Key(video)
    AWS.config.update({
        region: process.env.awsUploadRegion,
        credentials: {
            accessKeyId: process.env.awsAccessKeyId as string,
            secretAccessKey: process.env.awsSecretAccessKey as string,
            sessionToken: process.env.awsSessionToken as string,
        },
    })

    const sth = await rawVideo.arrayBuffer()
    const s3 = new S3()
    const uploadParams: PutObjectRequest = {
        Bucket: process.env.awsUploadBucket as string,
        Key: 'new_video_key.mp4',
        Body: sth,
    }

    s3.upload(uploadParams, async (err: Error, data: any) => {
        if (err) {
            logger.error(err)
        } else {
            logger.info(`File uploaded successfully. ${ data.Location }`)
            // await prisma.video.update({
            //     where: {
            //         id: video.id,
            //     },
            //     data: {
            //         s3Key: key,
            //     },
            // })
            console.log('Video uploaded tox S3: ' + data.Location)
        }
    })
}