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
import { getS3UploadBucket } from '@/utils/getS3UploadBucket'
import { VideoUploadData } from '@/types/video/video'
import {sendEmailFailureNotification} from '@/utils/emails/videoUploadFailure'

export function removeFileExtension(filename: string): string {
    return filename.replace(/\.[^/.]+$/, '')
}

// From https://stackoverflow.com/a/76640098/13337984
function isCompleteUpload(
    output: CompleteMultipartUploadCommandOutput | AbortMultipartUploadCommandOutput
): output is CompleteMultipartUploadCommandOutput {
    return (output as CompleteMultipartUploadCommandOutput).ETag !== undefined
}

export default async function sendVideo(rawVideo: File, owner: User, isFaceBlurChecked: boolean): Promise<Video> {
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
        region: process.env.AWS_UPLOAD_REGION_US,
    })

    const uploadS3 = new Upload({
        client: client,
        params: {
            Bucket: getS3UploadBucket(isFaceBlurChecked),
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
            isFaceblurFeatureEnabled: isFaceBlurChecked,
        },
    })

    // We only need to generate the metadata json if we are not blurring the user's face. In the case where their face is
    // blurred, the file is generated in the AWS transferring the video between the face-blurring and streaming pipelines
    if (!isFaceBlurChecked) {
        const metadataFile: string = JSON.stringify({
            videoId: newVideo.id,
            srcVideo: s3Key,
        })
        const uploadJson = new Upload({
            client: client,
            params: {
                Bucket: process.env.AWS_UPLOAD_BUCKET_STREAMING as string,
                Key: await makeS3Key(newVideo, 'json'),
                Body: metadataFile,
            },
        })
        const s3JsonData: CompleteMultipartUploadCommandOutput | AbortMultipartUploadCommandOutput =
            await uploadJson.done()
        if (!isCompleteUpload(s3JsonData) || s3JsonData.Location === undefined) {
            logger.error(s3JsonData)
            // TODO: Send email/notify to user there is an issue with uploading video
            throw new Error(`Unexpected error while uploading video metadata file for video ${ rawVideo.name } to S3`)
        }
    }

    return newVideo
}

export async function uploadVideo(videoData: VideoUploadData, user: User, fileExtension: string): Promise<Video> {
    const uploadedVideo: Video = await prisma.video.create({
        data: {
            owner: {
                connect: {
                    id: user.id,
                },
            },
            title: videoData.title,
            description: videoData.description,
        },
    })

    const s3uploadedVideoKey = await makeS3Key(uploadedVideo, fileExtension)

    const client = new S3Client({
        region: process.env.AWS_UPLOAD_REGION_US,
    })

    const s3VideoUpload = new Upload({
        client: client,
        params: {
            Bucket: getS3UploadBucket(videoData.blurFace),
            Key: s3uploadedVideoKey,
            Body: videoData.file,
        },
    })
    const s3VideoUploadResult: CompleteMultipartUploadCommandOutput | AbortMultipartUploadCommandOutput = await s3VideoUpload.done()
    if (!isCompleteUpload(s3VideoUploadResult) || !s3VideoUploadResult?.Location) {
        logger.error(s3VideoUploadResult)
        await sendEmailFailureNotification([user.email], videoData.title)

        // Delete database entry
        await prisma.video.delete({
            where: {
                id: uploadedVideo.id,
            },
        })

        throw new Error(`Unexpected error while uploading video ${ videoData.title } to S3`)
    }

    // Trigger the processing pipeline by uploading metadata
    if (!videoData.blurFace) {
        const metadataFile: string = JSON.stringify({
            videoId: uploadedVideo.id,
            srcVideo: s3uploadedVideoKey,
        })
        const uploadJson = new Upload({
            client: client,
            params: {
                Bucket: process.env.AWS_UPLOAD_BUCKET_STREAMING as string,
                Key: await makeS3Key(uploadedVideo, 'json'),
                Body: metadataFile,
            },
        })
        const s3JsonData: CompleteMultipartUploadCommandOutput | AbortMultipartUploadCommandOutput =
          await uploadJson.done()
        if (!isCompleteUpload(s3JsonData) || s3JsonData.Location === undefined) {
            logger.error(s3JsonData)
            await sendEmailFailureNotification([user.email], videoData.title)

            // Delete database entry
            await prisma.video.delete({
                where: {
                    id: uploadedVideo.id,
                },
            })

            throw new Error(`Unexpected error while uploading video metadata file for video ${ videoData.title } to S3`)
        }
    }

    await prisma.videoWhitelist.create({
        data: {
            video: {
                connect: {
                    id: uploadedVideo.id,
                },
            },
            whitelistedUsers: {
                create: {
                    whitelistedUser: {
                        connect: {
                            id: user.id,
                        },
                    },
                },
            },
        },
    })

    return uploadedVideo
}
