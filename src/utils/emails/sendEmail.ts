import {Message, SendEmailCommand, SESClient} from '@aws-sdk/client-ses'

export async function sendEmails(emailAddresses: string[], message: Message) {
    const ses = new SESClient({
        region: process.env.awsUploadRegion,
        credentials: {
            accessKeyId: process.env.awsAccessKeyId as string,
            secretAccessKey: process.env.awsSecretAccessKey as string,
            sessionToken: process.env.awsSessionToken as string,
        },
    })
    return ses.send(new SendEmailCommand({
        Destination: {
            ToAddresses: emailAddresses,
        },
        Message: message,
        Source: 'no-reply@harpvideo.ca',
    }))
}

export async function sendEmail(emailAddress: string, message: Message) {
    return sendEmails([emailAddress], message)
}
