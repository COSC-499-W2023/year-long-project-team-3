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

async function makeS3Key(video: Video, fileEnding: string): Promise<string> {
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
        region: process.env.awsUploadRegion,
        credentials: {
            accessKeyId: process.env.awsAccessKeyId as string,
            secretAccessKey: process.env.awsSecretAccessKey as string,
            sessionToken: process.env.awsSessionToken as string,
        },
    })

    const uploadS3 = new Upload({
        client: client,
        params: {
            Bucket: process.env.awsUploadBucket as string,
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
            Bucket: process.env.awsUploadBucket as string,
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
