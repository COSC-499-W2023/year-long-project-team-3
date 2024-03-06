import process from 'process'
import {sendEmails} from '@/utils/emails/sendEmail'
import {Message} from '@aws-sdk/client-ses'
import getTemplateMessage from '@/utils/emails/template'

export async function sendEmailFailureNotification(emails: string[], videoTitle: string) {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? 'https://harpvideo.ca'
    const uploadUrl = `${ baseUrl }/video/upload`

    const message = getFailureNotificationMessage(videoTitle, uploadUrl)
    return sendEmails(emails, message)
}

function getFailureNotificationMessage(videoTitle: string, link: string): Message {
    return getTemplateMessage(
        'Video Upload Failure - Harp Video',
        '',
        'Video Upload Failure',
        `The video "${ videoTitle }" you recently tried to upload failed while being processed on our servers. We apologize for any inconvenience this has caused. Please try uploading your video again. If this issue persists, please contact support.`,
        'TRY AGAIN',
        link,
    )
}
