import { Message } from '@aws-sdk/client-ses'
import process from 'process'
import { sendEmails } from '@/utils/emails/sendEmail'
import { SubmissionBox } from '@prisma/client'
import dayjs from 'dayjs'
import getTemplateMessage from '@/utils/emails/template'

export async function sendSubmissionInvitations(emails: string[], ownerEmail: string, submissionBox: SubmissionBox) {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? 'https://harpvideo.ca'
    const boxUrl = `${ baseUrl }/submission-box/${ submissionBox.id }`

    const date = submissionBox.closesAt
    const formattedDate = date && dayjs(date).format('dddd MMM D, h:mma')

    const message = getSubmissionInvitationMessage(ownerEmail, boxUrl, submissionBox.title, formattedDate)
    return sendEmails(emails, message)
}

function getSubmissionInvitationMessage(
    ownerEmail: string,
    link: string,
    title: string,
    closingDate: string | null,
): Message {
    return getTemplateMessage(
        `Submission Box Invitation - ${ title } - Harp Video`,
        'YOU\'VE BEEN INVITED!',
        'View Submission Invitation',
        `${ ownerEmail } has invited you to submit a video to "${ title }". ${ closingDate ? 'The deadline to submit is ' + closingDate + '. ' : '' }Please click the button below to get started!`,
        'SUBMIT VIDEO',
        link,
    )
}
