const SQSConsumer = require('sqs-consumer')
const { Consumer } = SQSConsumer
const ClientSqs = require('@aws-sdk/client-sqs')
const { Message, SQSClient } = ClientSqs

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
    queueUrl: 'https://sqs.ca-central-1.amazonaws.com/932748244514/video-stream-process',
    handleMessage: async (message: typeof Message) => {
        const videoMetadata = JSON.parse(message.Body)
        const videoId: number = videoMetadata.videoId
        await prisma.video.update({
            where: {
                videoId: videoId,
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
        region: 'ca-central-1',
    }),
})

app.on('error', (err: any) => {
    console.error(err.message)
})

app.on('processing_error', (err: any) => {
    console.error(err.message)
})

app.start()
