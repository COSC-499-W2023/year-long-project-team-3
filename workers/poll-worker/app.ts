import { Consumer } from 'sqs-consumer'
import { SQSClient } from '@aws-sdk/client-sqs'
import { PrismaClient } from '@prisma/client'

const prismaClientSingleton = () => {
    return new PrismaClient()
}

const globalForPrisma = globalThis
const prisma = globalForPrisma.prisma ?? prismaClientSingleton()
if (process.env.NODE_ENV !== 'production') {
    globalForPrisma.prisma = prisma
}

const app = Consumer.create({
    queueUrl: 'https://sqs.ca-central-1.amazonaws.com/932748244514/video-stream-process',
    handleMessage: async (message) => {
        const videoMetadata = JSON.parse(message.Body)
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
