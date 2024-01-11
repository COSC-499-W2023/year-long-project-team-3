import {Message, SendEmailCommand, SESClient} from '@aws-sdk/client-ses'

export async function sendEmail(address: string, message: Message) {
    const ses = new SESClient({
        region: process.env.awsUploadRegion,
        credentials: {
            accessKeyId: process.env.awsAccessKeyId as string,
            secretAccessKey: process.env.awsSecretAccessKey as string,
            sessionToken: process.env.awsSessionToken as string,
        },
    })
    await ses.send(new SendEmailCommand({
        Destination: {
            ToAddresses: [
                address,
            ],
        },
        Message: message,
        Source: 'no-reply@harpvideo.ca',
    }))
}
