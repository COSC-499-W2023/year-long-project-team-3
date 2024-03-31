import { NextRequest, NextResponse } from 'next/server'
import logger from '@/utils/logger'
import { getServerSession } from 'next-auth'
import prisma from '@/lib/prisma'
import { sendSubmissionInvitations } from '@/utils/emails/submissionInvitation'

type SubmissionBoxInvitationData = {
    submissionBoxId: string
    emails: string[]
}

function validateData(data: any): data is SubmissionBoxInvitationData {
    return !!data.submissionBoxId &&
        typeof data.submissionBoxId === 'string' &&
        !!data.emails && Array.isArray(data.emails) &&
        (data.emails.length === 0 || data.emails.every((email: any) => typeof email === 'string'))
}

/* Invites users to a submission box. Returns nothing.
 *
 * Request format: `{ submissionBoxId: string; emails: string[] }`
 */
export async function POST(req: NextRequest) {
    try {
        // Get and validate request data
        const data = await req.json()
        if (!validateData(data)) {
            return NextResponse.json({ error: 'Invalid request data' }, { status: 400 })
        }

        const session = await getServerSession()
        if (!session || !session.user?.email) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        // Check that user owns submission box
        const submissionBox = await prisma.submissionBox.findUnique({
            where: { id: data.submissionBoxId },
        })
        if (!submissionBox) {
            logger.error('Submission box invitation API: Invalid submission box')
            return NextResponse.json({ error: 'Bad Request' }, { status: 400 })
        }
        const owners = await prisma.submissionBoxManager.findMany({
            where: { submissionBoxId: data.submissionBoxId },
            select: {
                userId: true,
            },
        })
        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
            select: {
                id: true,
                email: true,
            },
        })
        if (!user || !owners.find(owner => owner.userId === user.id)) {
            logger.error('Submission box invitation API: User does not own box')
            return NextResponse.json({ error: 'Bad Request' }, { status: 400 })
        }

        // Remove emails that are already invited
        const invitedEmails = await prisma.requestedSubmission.findMany({
            where: { submissionBoxId: data.submissionBoxId },
            select: {
                email: true,
            },
        })
        const newEmails = data.emails.filter(email => !invitedEmails.find(invited => invited.email === email))

        // Get any users that already exist
        const users =
            newEmails.length === 0
                ? []
                : await prisma.user.findMany({
                    select: {
                        id: true,
                        email: true,
                    },
                    where: {
                        email: {
                            in: data?.emails,
                        },
                    },
                })

        // Convert the array of users to a dictionary for easy lookups
        const existingUsers = users.reduce((userRecord: Record<string, string>, user) => {
            userRecord[user.email] = user.id
            return userRecord
        }, {})

        // Create submission requests
        await prisma.requestedSubmission.createMany({
            data: newEmails.map((email) => {
                return {
                    email: email,
                    userId: existingUsers[email] ?? null,
                    submissionBoxId: data.submissionBoxId,
                }
            }),
        })

        // Send email invitations
        if (newEmails.length > 0) {
            await sendSubmissionInvitations(newEmails, user.email, submissionBox)
        }

        return NextResponse.json({ message: 'Users invited' }, { status: 201 })
    } catch (e) {
        logger.error('API failed to invite user to submission box: ' + e)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}

/* Un-invites users to a submission box. Returns nothing.
 *
 * Request format: `{ submissionBoxId: string; emails: string[] }`
 */
export async function DELETE(req: NextRequest) {
    try {
        // Get and validate request data
        const data = await req.json()
        if (!validateData(data)) {
            return NextResponse.json({ error: 'Invalid request data' }, { status: 400 })
        }

        const session = await getServerSession()
        if (!session || !session.user?.email) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        // Check that user owns submission box
        const submissionBox = await prisma.submissionBox.findUnique({
            where: { id: data.submissionBoxId },
        })
        if (!submissionBox) {
            logger.error('Submission box un-invite API: Invalid submission box')
            return NextResponse.json({ error: 'Bad Request' }, { status: 400 })
        }
        const owners = await prisma.submissionBoxManager.findMany({
            where: { submissionBoxId: data.submissionBoxId },
            select: {
                userId: true,
            },
        })
        const owner = await prisma.user.findUnique({
            where: { email: session.user.email },
            select: {
                id: true,
                email: true,
            },
        })
        if (!owner || !owners.find(o => o.userId === owner.id)) {
            logger.error('Submission box un-invite API: User does not own box')
            return NextResponse.json({ error: 'Bad Request' }, { status: 400 })
        }

        // Check if any of the users being uninvited had a submission
        const requestedSubmissions = await prisma.requestedSubmission.findMany({
            where: {
                email: {
                    in: data.emails,
                },
            },
        })
        const submittedVideos = await prisma.submittedVideo.findMany({
            where: {
                requestedSubmissionId: {
                    in: requestedSubmissions.map((request) => request.id),
                },
            },
            select: {
                videoId: true,
                requestedSubmissionId: true,
                video: true,
            },
        })

        // For each video submitted, remove box owner from video whitelist if the owner does not get privilege to view it from a different submission box they own
        const ownedBoxes = await prisma.submissionBoxManager.findMany({
            where: {
                userId: owner.id,
                submissionBoxId: {
                    not: data.submissionBoxId,
                },
            },
            select: {
                submissionBox: {
                    include: {
                        requestedSubmissions: true,
                    },
                },
            },
        })
        const ownedRequestedSubmissions = ownedBoxes.flatMap(
            box => box.submissionBox.requestedSubmissions
        ).map(
            requestedSubmission => requestedSubmission.id
        )
        // List of video ids that have been submitted to other submission boxes managed by the logged-in user
        const submittedVideosToOwnedBoxes = (
            await prisma.submittedVideo.findMany({
                where: {
                    requestedSubmissionId: {
                        in: ownedRequestedSubmissions,
                    },
                },
                select: {
                    videoId: true,
                },
            })
        ).map(submittedVideo => submittedVideo.videoId)

        logger.info(submittedVideosToOwnedBoxes)
        console.log(submittedVideosToOwnedBoxes)

        // For each video submitted to the box they are being un-invited from, if that video is not in the above list, remove the logged-in user from the whitelist of that video
        await prisma.videoWhitelistedUser.deleteMany({
            where: {
                whitelistedVideo: {
                    videoId: {
                        in: submittedVideos.map(submittedVideo => submittedVideo.videoId)
                            .filter(id => !submittedVideosToOwnedBoxes.includes(id)),
                    },
                },
                whitelistedUserId: owner.id,
            },
        })

        // Now delete the submitted videos
        await Promise.all(submittedVideos.map(async submittedVideo => {
            await prisma.submittedVideo.delete({
                where: {
                    // eslint-disable-next-line camelcase
                    videoId_requestedSubmissionId: {
                        videoId: submittedVideo.videoId,
                        requestedSubmissionId: submittedVideo.requestedSubmissionId,
                    },
                },
            })
        }))

        // Un-invite emails
        await prisma.requestedSubmission.deleteMany({
            where: {
                email: {
                    in: data.emails,
                },
            },
        })

        return NextResponse.json({ message: 'Users un-invited' }, { status: 200 })
    } catch (e) {
        logger.error('API failed to invite user to submission box: ' + e)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
