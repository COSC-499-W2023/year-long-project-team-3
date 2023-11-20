import { Consumer } from 'sqs-consumer'
import { Message, SQSClient } from '@aws-sdk/client-sqs'

/* TODO: Remove Prisma Stuff */
import { PrismaClient } from '@prisma/client'

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
    handleMessage: async (message: Message) => {
        const videoMetadata = JSON.parse(<string>message.Body)
        console.log(videoMetadata.videoId)
    },
    sqs: new SQSClient({
        region: 'ca-central-1',
    }),
})

app.on('error', (err) => {
    console.error(err.message)
})

app.on('processing_error', (err) => {
    console.error(err.message)
})

app.start()
