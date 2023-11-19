import { Consumer } from 'sqs-consumer'

const app = Consumer.create({
    queueUrl: 'https://sqs.ca-central-1.amazonaws.com/932748244514/video-stream-process-dlq',
    handleMessage: async (message) => {
        console.log(message)
    },
})

app.on('error', (err) => {
    console.error(err.message)
})

app.on('processing_error', (err) => {
    console.error(err.message)
})

app.start()
