import { User, Video } from '@prisma/client'
import AWS from 'aws-sdk'
import S3, { PutObjectRequest } from 'aws-sdk/clients/s3'
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3'
import logger from './logger'
import prisma from '@/lib/prisma'

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
        },
    })

    const s3Key = await makeS3Key(newVideo, 'mp4')
    const rawVideoBuffer = await rawVideo.arrayBuffer()
    const uploadParams: PutObjectRequest = {
        Bucket: process.env.awsUploadBucket as string,
        Key: s3Key,
        Body: Buffer.from(rawVideoBuffer),
    }

    s3.upload(uploadParams, async (err: Error, data: any) => {
        if (err) {
            logger.error(err)
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
                rawVideoUrl: data.Location,
            },
        })

        logger.info(`File ${ newVideo.id } uploaded to S3 successfully.`)

        const client: S3Client = new S3Client({ region: process.env.awsUploadRegion })
        const metadataFile = JSON.stringify({
            videoId: newVideo.id,
            srcVideo: s3Key,
        })
        const command: PutObjectCommand = new PutObjectCommand({
            Bucket: process.env.awsUploadBucket as string,
            Key: await makeS3Key(newVideo, 'json'),
            Body: metadataFile,
        })
        try {
            const response = await client.send(command)
            logger.info('Metadata file uploaded successfully')
        } catch (error) {
            logger.error(`There was an error in uploading the metadata file: ${ error }`)
        }
    })
    return newVideo
}
