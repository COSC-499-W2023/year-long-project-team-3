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

function _removeFileExtension(filename: string): string {
    // TODO: Remove this when using title instead of filename
    return filename.replace(/\.[^/.]+$/, '')
}


// Fom https://stackoverflow.com/a/76640098/13337984
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
            // TODO: Add title when have supported UI, for now use file name instead
            title: _removeFileExtension(rawVideo.name),
            // TODO: Add description when have supported UI
            description: '',
        },
    })

    const s3Key = await makeS3Key(newVideo)
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

    return prisma.video.update({
        where: {
            id: newVideo.id,
        },
        data: {
            s3Key: s3Key,
            rawVideoUrl: s3Data.Location,
        },
    })
}
