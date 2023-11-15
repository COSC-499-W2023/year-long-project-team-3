import { User, Video } from '@prisma/client'
import AWS from 'aws-sdk'
import S3, { PutObjectRequest } from 'aws-sdk/clients/s3'
import logger from './logger'
import prisma from '@/lib/prisma'

async function makeS3Key(video: Video): Promise<string> {
    if (!video.ownerId) {
        // TODO: Remove this when adding anonymized feature
        throw new Error(`Missing ownerId in video ${ video.id }`)
    }

    try {
        return `${ video.title }_${ video.ownerId }_${ video.id }.mp4`
    } catch (error) {
        throw new Error(`Unexpected error while fetching owner of video ${ video.id }`)
    }
}

export default async function sendVideo(rawVideo: File, owner: User): Promise<Video> {
    AWS.config.update({
        region: process.env.awsUploadRegion,
        credentials: {
            accessKeyId: process.env.awsAccessKeyId as string,
            secretAccessKey: process.env.awsSecretAccessKey as string,
            sessionToken: process.env.awsSessionToken as string,
        },
    })
    const s3 = new S3()

    const newVideo: Video = await prisma.video.create({
        data: {
            owner: {
                connect: {
                    id: owner.id,
                },
            },
            // TODO: Add title when have supported UI, for now use file name instead
            title: rawVideo.name,
            // TODO: Add description when have supported UI
            description: '',
            videoWhitelist: {
                create: {
                    users: {
                        connect: {
                            id: owner.id,
                        },
                    },
                },
            },
        },
    })

    const s3Key = await makeS3Key(newVideo)
    const rawVideoBuffer = await rawVideo.arrayBuffer()
    const uploadParams: PutObjectRequest = {
        Bucket: process.env.awsUploadBucket as string,
        Key: s3Key,
        Body: Buffer.from(rawVideoBuffer),
    }

    s3.upload(uploadParams, async (err: Error, data: any) => {
        if (err) {
            logger.error(err)
            throw new Error(`Unexpected error while uploading video ${ rawVideo.name } to S3`)
        }

        logger.info(`File ${ newVideo.id } uploaded successfully.`)
        await prisma.video.update({
            where: {
                id: newVideo.id,
            },
            data: {
                s3Key: s3Key,
                videoUrl: data.Location,
            },
        })
    })

    return newVideo
}
