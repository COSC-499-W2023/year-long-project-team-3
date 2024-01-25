import {Message, SendEmailCommand, SESClient} from '@aws-sdk/client-ses'

export async function sendEmails(emailAddresses: string[], message: Message) {
    const ses = new SESClient({
        region: process.env.AWS_UPLOAD_REGION_CANADA,
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
