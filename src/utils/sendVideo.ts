import prisma from '@/lib/prisma'
import { User, Video } from '@prisma/client'
import AWS from 'aws-sdk'
import S3, { PutObjectRequest } from 'aws-sdk/clients/s3'
import logger from './logger'
import { generateUUID } from 'listr2/dist/utils/uuid'
import fs, { PathLike } from 'fs'

AWS.config.update({
    region: process.env.awsUploadRegion,

})

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

export default async function sendVideo(temporaryVideoPath: PathLike, video: Video) {
    const key = await makeS3Key(video)

    const fileStream = fs.createReadStream(temporaryVideoPath)

    const s3 = new S3()
    const uploadParams: PutObjectRequest = {
        Bucket: process.env.awsUploadBucket as string,
        Key: key,
        Body: fileStream,
    }

    s3.upload(uploadParams, async (err: Error, data: any) => {
        if (err) {
            logger.error(err)
        } else {
            logger.info(`File uploaded successfully. ${ data.Location }`)
            await prisma.video.update({
                where: {
                    id: video.id,
                },
                data: {

                },
            })
        }
    })
}