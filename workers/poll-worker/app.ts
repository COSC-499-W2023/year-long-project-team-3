import logger from './logger'
import { Consumer } from 'sqs-consumer'
import { SQSClient } from '@aws-sdk/client-sqs'

/* TODO: Remove Prisma Stuff */
const Prisma = require('@prisma/client')
const { PrismaClient } = Prisma

const prismaClientSingleton = () => {
    return new PrismaClient()
}

type PrismaClientSingleton = ReturnType<typeof prismaClientSingleton>

const globalForPrisma = globalThis as unknown as {
    prisma: PrismaClientSingleton | undefined
}

const prisma = globalForPrisma.prisma ?? prismaClientSingleton()

const app = Consumer.create({
    queueUrl: <string>process.env.QUEUE_URL,
    handleMessage: async (message) => {
        const videoMetadata = JSON.parse(<string>message.Body)
        const videoId: number = videoMetadata.videoId
        await prisma.video.update({
            where: {
                id: videoId,
            },
            data: {
                s3Key: videoMetadata.guid,
                isCloudProcessed: true,
                processedVideoUrl: videoMetadata.hlsUrl,
                thumbnail: videoMetadata.thumbNailsUrls[0],
            },
        })
    },
    sqs: new SQSClient({
        region: process.env.AWS_UPLOAD_REGION,
    }),
})

app.on('error', (err: any) => {
    logger.error(err.message)
})

app.on('processing_error', (err: any) => {
    logger.error(err.message)
})

app.start()
