import { User, Video } from '@prisma/client'
import {
    S3Client,
    type CompleteMultipartUploadCommandOutput,
    type AbortMultipartUploadCommandOutput,
} from '@aws-sdk/client-s3'
import { Upload } from '@aws-sdk/lib-storage'
import logger from './logger'
import prisma from '@/lib/prisma'
import { Readable } from 'stream'
import { makeS3Key } from './s3Key'

export function removeFileExtension(filename: string): string {
    return filename.replace(/\.[^/.]+$/, '')
}

// From https://stackoverflow.com/a/76640098/13337984
function isCompleteUpload(
    output: CompleteMultipartUploadCommandOutput | AbortMultipartUploadCommandOutput
): output is CompleteMultipartUploadCommandOutput {
    return (output as CompleteMultipartUploadCommandOutput).ETag !== undefined
}

export default async function sendVideo(rawVideo: File, owner: User): Promise<Video> {
    const newVideo: Video = await prisma.video.create({
        data: {
            owner: {
                connect: {
                    id: owner.id,
                },
            },
            title: removeFileExtension(rawVideo.name),
            // TODO: Add description when have supported UI
            description: '',
        },
    })

    const s3Key = await makeS3Key(newVideo, 'mp4')
    const rawVideoBuffer = await rawVideo.arrayBuffer()

    const client = new S3Client({
        region: process.env.AWS_UPLOAD_REGION,
        credentials: {
            accessKeyId: process.env.AWS_ACCESS_KEY_ID as string,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY as string,
            sessionToken: process.env.AWS_SESSION_TOKEN as string,
        },
    })

    const uploadS3 = new Upload({
        client: client,
        params: {
            Bucket: process.env.AWS_UPLOAD_BUCKET as string,
            Key: s3Key,
            Body: Readable.from(Buffer.from(rawVideoBuffer)),
        },
    })

    const s3Data: CompleteMultipartUploadCommandOutput | AbortMultipartUploadCommandOutput = await uploadS3.done()
    if (!isCompleteUpload(s3Data) || s3Data.Location === undefined) {
        logger.error(s3Data)
        // TODO: Send email/notify to user there is an issue with uploading video
        throw new Error(`Unexpected error while uploading video ${ rawVideo.name } to S3`)
    }

    await prisma.videoWhitelist.create({
        data: {
            video: {
                connect: {
                    id: newVideo.id,
                },
            },
            whitelistedUsers: {
                create: {
                    whitelistedUser: {
                        connect: {
                            id: owner.id,
                        },
                    },
                },
            },
        },
    })

    await prisma.video.update({
        where: {
            id: newVideo.id,
        },
        data: {
            s3Key: s3Key,
            rawVideoUrl: s3Data.Location,
        },
    })

    const metadataFile: string = JSON.stringify({
        videoId: newVideo.id,
        srcVideo: s3Key,
    })
    const uploadJson = new Upload({
        client: client,
        params: {
            Bucket: process.env.AWS_UPLOAD_BUCKET as string,
            Key: await makeS3Key(newVideo, 'json'),
            Body: metadataFile,
        },
    })
    const s3JsonData: CompleteMultipartUploadCommandOutput | AbortMultipartUploadCommandOutput = await uploadJson.done()
    if (!isCompleteUpload(s3JsonData) || s3JsonData.Location === undefined) {
        logger.error(s3JsonData)
        // TODO: Send email/notify to user there is an issue with uploading video
        throw new Error(`Unexpected error while uploading video metadata file for video ${ rawVideo.name } to S3`)
    }

    return newVideo
}
